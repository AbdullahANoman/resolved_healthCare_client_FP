// components/Doctors/DoctorScheduleSlots.tsx
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useCreateAppointmentMutation } from "@/redux/api/appointmentApi";
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi";
import {
  useInitialPaymentMutation,
  useGetPaymentStatusQuery,
  useCancelPaymentMutation,
  useValidPaymentMutation
} from "@/redux/api/paymentApi";
import { DoctorSchedule } from "@/types/doctorSchedules";
import { dateFormatter, getTimeIn12HourFormat } from "@/utils/dateFormatter";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  ExternalLink,
  RefreshCw,
  X,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";
import { format } from "date-fns";

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

interface PaymentInfo {
  paymentId?: string;
  transactionId?: string;
  paymentUrl?: string;
  status?: PaymentStatus;
}

const DoctorScheduleSlots = ({ id }: { id: string }) => {
  const [scheduleId, setScheduleId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({});
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [appointmentId, setAppointmentId] = useState<string>("");
  

  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameters
  const query: Record<string, any> = {
    doctorId: id,
    page: 1,
    limit: 100,
  };

  if (selectedDate) {
    const startOfDay = dayjs(selectedDate).startOf("day").toISOString();
    const endOfDay = dayjs(selectedDate).endOf("day").toISOString();
    query["startDate"] = startOfDay;
    query["endDate"] = endOfDay;
  }

  const { data, isLoading, refetch } = useGetAllDoctorSchedulesQuery({
    ...query,
  });
  const doctorSchedules: DoctorSchedule[] =
    (data as { doctorSchedules?: DoctorSchedule[] })?.doctorSchedules ?? [];

  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentMutation();
  const [initialPayment, { isLoading: isProcessingPayment }] = useInitialPaymentMutation();
  const { data: paymentStatusData, refetch: refetchPaymentStatus } = useGetPaymentStatusQuery(
    paymentInfo.paymentId || '',
    { skip: !paymentInfo.paymentId }
  );

  console.log(paymentInfo)
  
  const [cancelPayment, { isLoading: isCancelling }] = useCancelPaymentMutation();
  const [validatePayment] = useValidPaymentMutation();

  // Group schedules by date
  const groupedSchedules = useMemo(() => {
    return doctorSchedules.reduce(
      (groups: Record<string, DoctorSchedule[]>, schedule: DoctorSchedule) => {
        const date = dayjs(schedule.schedule.startDateTime).format("YYYY-MM-DD");
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(schedule);
        return groups;
      },
      {}
    );
  }, [doctorSchedules]);

  // Sort dates
  const sortedDates = useMemo(() => {
    return Object.keys(groupedSchedules).sort((a, b) =>
      dayjs(a).isAfter(dayjs(b)) ? 1 : -1
    );
  }, [groupedSchedules]);

  const availableSlotsCount = useMemo(() => {
    return doctorSchedules.filter(
      (schedule: DoctorSchedule) => !schedule.isBooked
    ).length;
  }, [doctorSchedules]);

  const isSelectedSlotAvailable = useMemo(() => {
    if (!scheduleId) return false;
    const selectedSchedule = doctorSchedules.find(
      (schedule: DoctorSchedule) => schedule.scheduleId === scheduleId
    );
    return selectedSchedule && !selectedSchedule.isBooked;
  }, [scheduleId, doctorSchedules]);

  const selectedSchedule = useMemo(() => {
    return doctorSchedules.find(
      (schedule: DoctorSchedule) => schedule.scheduleId === scheduleId
    );
  }, [scheduleId, doctorSchedules]);

  // Poll payment status
  const startPaymentPolling = useCallback((paymentId: string) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const result = await refetchPaymentStatus();
        if (result.data) {
          const status = result.data?.status || result.data?.response?.status;

          if (status === 'PAID' || status === 'success') {
            clearInterval(interval);
            setPollingInterval(null);

            toast.success("Payment confirmed! Appointment booked.", {
              duration: 3000,
            });

            setPaymentInfo(prev => ({ ...prev, status: 'success' }));
            setShowPaymentDialog(false);
            refetch();
            setScheduleId("");
          } else if (status === 'failed' || status === 'cancelled') {
            clearInterval(interval);
            setPollingInterval(null);

            toast.error("Payment failed. Please try again.");
            setPaymentInfo(prev => ({ ...prev, status: 'failed' }));
          }
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    }, 3000);

    setPollingInterval(interval);
  }, [pollingInterval, refetchPaymentStatus]);

  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!isSelectedSlotAvailable) {
      toast.error("This time slot is no longer available.");
      setScheduleId("");
      return;
    }

    setIsProcessing(true);
    setShowConfirmDialog(false);

    try {
      const appointment = await createAppointment({
        doctorId: id,
        scheduleId,
      }).unwrap();

      if (appointment.id) {
        setAppointmentId(appointment.id);
        const payment = await initialPayment(appointment.id).unwrap();

        if (payment?.paymentUrl) {
          setPaymentInfo({
            paymentId: payment.paymentId,
            transactionId: payment.transactionId,
            paymentUrl: payment.paymentUrl,
            status: 'pending',
          });

          toast.success("Appointment created! Proceed with payment.", {
            duration: 3000,
          });

          setShowPaymentDialog(true);
          startPaymentPolling(payment.paymentId);
        }
      }
    } catch (error: any) {
      toast.error("Failed to book appointment. Please try again.", {
        description: error?.data?.message || "An unexpected error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment cancellation
  const handleCancelPayment = async () => {
     setShowPaymentDialog(false);
    if (!paymentInfo.paymentId) return;

    try {
      await cancelPayment(paymentInfo.paymentId).unwrap();

      toast.success("Payment cancelled successfully.");

      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }

      setShowPaymentDialog(false);
      setPaymentInfo({});
      refetch();
    } catch (error: any) {
      toast.error("Failed to cancel payment. Please try again.");
    } finally {
      setShowCancelDialog(false);
    }
  };

  // Clear date filter
  const handleClearDateFilter = () => {
    setSelectedDate(undefined);
    refetch();
  };

  // Open payment page
  const openPaymentPage = async () => {
  const res = await validatePayment({ tran_id: paymentInfo?.transactionId });

  if (paymentInfo?.paymentUrl) {
    router.push(paymentInfo.paymentUrl,);
  }
};

  if (isLoading) {
    return (
      <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-9 w-24" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Available Time Slots</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {availableSlotsCount} slots available
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-[180px] justify-start",
                      !selectedDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? (
                      format(selectedDate, "MMM dd")
                    ) : (
                      "Filter by date"
                    )}
                    {selectedDate && (
                      <X
                        className="ml-auto h-3 w-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearDateFilter();
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      return date < yesterday;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {Object.keys(groupedSchedules).length === 0 ? (
            <Alert className="border-gray-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {selectedDate
                  ? `No slots for ${format(selectedDate, "MMM dd")}. Try another date.`
                  : "No schedules available."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {sortedDates.map((date) => {
                const schedulesForDate = groupedSchedules[date];
                const availableForDate = schedulesForDate.filter(
                  (schedule: DoctorSchedule) => !schedule.isBooked
                );

                if (availableForDate.length === 0) return null;

                return (
                  <div key={date} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {dateFormatter(date)}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {availableForDate.length} slots
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {availableForDate.map(
                        (doctorSchedule: DoctorSchedule) => {
                          const isSelected =
                            doctorSchedule.scheduleId === scheduleId;
                          const formattedTime = `${getTimeIn12HourFormat(
                            doctorSchedule.schedule.startDateTime
                          )} - ${getTimeIn12HourFormat(
                            doctorSchedule.schedule.endDateTime
                          )}`;

                          return (
                            <Button
                              key={doctorSchedule.scheduleId}
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => {
                                if (!doctorSchedule.isBooked) {
                                  setScheduleId(doctorSchedule.scheduleId);
                                  setShowConfirmDialog(true);
                                }
                              }}
                              disabled={doctorSchedule.isBooked}
                              className={cn(
                                "h-9 justify-center",
                                isSelected
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "hover:bg-blue-50"
                              )}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-sm">{formattedTime}</span>
                            </Button>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Slot Details */}
          {scheduleId && selectedSchedule && (
            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Selected Appointment
                  </h4>
                  <div className="text-sm text-gray-700">
                    {dateFormatter(selectedSchedule.schedule.startDateTime)} •
                    {getTimeIn12HourFormat(selectedSchedule.schedule.startDateTime)} -
                    {getTimeIn12HourFormat(selectedSchedule.schedule.endDateTime)}
                  </div>
                  {!isSelectedSlotAvailable && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      Slot no longer available
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!isSelectedSlotAvailable || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Confirm & Pay
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Confirm Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Review details before payment
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {selectedSchedule && dateFormatter(selectedSchedule.schedule.startDateTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {selectedSchedule &&
                    `${getTimeIn12HourFormat(selectedSchedule.schedule.startDateTime)} - ${getTimeIn12HourFormat(selectedSchedule.schedule.endDateTime)}`
                  }
                </p>
              </div>
            </div>
            <Alert className="bg-blue-50 border-blue-200 py-2 ">
              <div className="flex items-center gap-2">

              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700 text-sm">
                Slot reserved for 15 minutes during payment
              </AlertDescription>
              </div>
            </Alert>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBookAppointment}
              disabled={isProcessing}
              className="bg-blue-600"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Dialog */}
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Payment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please complete payment to confirm appointment
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-3">
            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Status</span>
              <Badge
                variant={
                  paymentInfo.status === 'success' ? 'default' :
                    paymentInfo.status === 'failed' ? 'destructive' :
                      'secondary'
                }
                className="text-xs"
              >
                {paymentInfo.status?.toUpperCase() || 'PENDING'}
              </Badge>
            </div>

            {/* Payment Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-medium">{paymentInfo.transactionId}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={openPaymentPage}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Payment Page
              </Button>

              <Button
                variant="outline"
                onClick={() => refetchPaymentStatus()}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Status
              </Button>

              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={isCancelling}
                size="sm"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Payment Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? Your appointment slot will be released.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel >No, Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelPayment}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DoctorScheduleSlots;