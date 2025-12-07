/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useCreateAppointmentMutation } from "@/redux/api/appointmentApi";
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi";
import { useInitialPaymentMutation } from "@/redux/api/paymentApi";
import { DoctorSchedule } from "@/types/doctorSchedules";
import { dateFormatter, getTimeIn12HourFormat } from "@/utils/dateFormatter";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";
import { format } from "date-fns";

const DoctorScheduleSlots = ({ id }: { id: string }) => {
  const [scheduleId, setScheduleId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("all");
  const router = useRouter();

  // Query parameters
  const query: Record<string, any> = {
    doctorId: id,
    page: 1,
    limit: 100,
  };

  // Add date filter if selected
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

  const [createAppointment, { isLoading: isBooking }] =
    useCreateAppointmentMutation();
  const [initialPayment, { isLoading: isProcessingPayment }] =
    useInitialPaymentMutation();

  // Group schedules by date
  const groupedSchedules = useMemo(() => {
    return doctorSchedules.reduce(
      (groups: Record<string, DoctorSchedule[]>, schedule: DoctorSchedule) => {
        const date = dayjs(schedule.schedule.startDateTime).format(
          "YYYY-MM-DD"
        );
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(schedule);
        return groups;
      },
      {}
    );
  }, [doctorSchedules]);

  // Sort dates in ascending order
  const sortedDates = useMemo(() => {
    return Object.keys(groupedSchedules).sort((a, b) =>
      dayjs(a).isAfter(dayjs(b)) ? 1 : -1
    );
  }, [groupedSchedules]);

  // Get today's and tomorrow's dates for tabs
  const today = dayjs().format("YYYY-MM-DD");
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

  // Filter schedules based on active tab
  const filteredDates = useMemo(() => {
    if (activeTab === "today") {
      return sortedDates.filter((date) => date === today);
    } else if (activeTab === "tomorrow") {
      return sortedDates.filter((date) => date === tomorrow);
    } else if (activeTab === "upcoming") {
      return sortedDates.filter((date) => dayjs(date).isAfter(tomorrow, "day"));
    }
    return sortedDates;
  }, [sortedDates, activeTab, today, tomorrow]);

  // Get available slots count
  const availableSlotsCount = useMemo(() => {
    return doctorSchedules.filter(
      (schedule: DoctorSchedule) => !schedule.isBooked
    ).length;
  }, [doctorSchedules]);

  // Check if selected slot is available
  const isSelectedSlotAvailable = useMemo(() => {
    if (!scheduleId) return false;
    const selectedSchedule = doctorSchedules.find(
      (schedule: DoctorSchedule) => schedule.scheduleId === scheduleId
    );
    return selectedSchedule && !selectedSchedule.isBooked;
  }, [scheduleId, doctorSchedules]);

  // Handle appointment booking
  const handleBookAppointment = async () => {
    console.log("click handle booking");
    if (!isSelectedSlotAvailable) {
      toast.error(
        "This time slot is no longer available. Please select another slot."
      );
      setScheduleId("");
      return;
    }

    try {
      console.log(id, scheduleId);
      const appointment = await createAppointment({
        doctorId: id,
        scheduleId,
      }).unwrap();

      console.log(appointment);

      if (appointment.id) {
        console.log(appointment.id, "from appointment id ");
        const payment = await initialPayment(appointment.id).unwrap();
        console.log(payment);

        if (payment?.paymentUrl) {
          toast.success("Appointment created! Redirecting to payment...");
          setTimeout(() => {
            router.push(payment?.paymentUrl);
          }, 1000);
        }
      }
    } catch (error: any) {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  // Format day name with special labels
  const formatDayLabel = (dateString: string) => {
    const date = dayjs(dateString);

    if (date.isSame(today, "day")) return "Today";
    if (date.isSame(tomorrow, "day")) return "Tomorrow";

    return date.format("dddd");
  };

  // Clear date filter
  const handleClearDateFilter = () => {
    setSelectedDate(undefined);
    refetch();
  };

  // Get selected schedule details
  const selectedSchedule = useMemo(() => {
    return doctorSchedules.find(
      (schedule: DoctorSchedule) => schedule.scheduleId === scheduleId
    );
  }, [scheduleId, doctorSchedules]);

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Available Time Slots</CardTitle>
              <CardDescription>
                Select a time slot to book your appointment
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {availableSlotsCount} slots available
              </Badge>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "PPP")
                      : "Filter by date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      // Disable past dates
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      return date < yesterday;
                    }}
                    initialFocus
                  />
                  {selectedDate && (
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearDateFilter}
                        className="w-full"
                      >
                        Clear filter
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Tabs for quick filtering */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all">All Slots</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredDates.length === 0 ? (
            <Alert>
              <AlertDescription>
                {selectedDate
                  ? `No available slots for ${format(selectedDate, "PPP")}`
                  : "No schedules available for this doctor at the moment."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {filteredDates.map((date) => {
                const schedulesForDate = groupedSchedules[date];
                const availableForDate = schedulesForDate.filter(
                  (schedule: DoctorSchedule) => !schedule.isBooked
                );

                if (availableForDate.length === 0) return null;

                return (
                  <div key={date} className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {dateFormatter(date)}
                        <Badge variant="secondary">
                          {formatDayLabel(date)}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {availableForDate.length} available slot(s)
                      </p>
                    </div>
                    <Separator />

                    <div className="flex flex-wrap gap-3">
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
                              onClick={() =>
                                setScheduleId(doctorSchedule.scheduleId)
                              }
                              className={cn(
                                "relative transition-all duration-200",
                                isSelected &&
                                  "ring-2 ring-primary ring-offset-2"
                              )}
                            >
                              {formattedTime}
                              {doctorSchedule.isBooked && (
                                <Badge
                                  variant="destructive"
                                  className="absolute -top-2 -right-2 text-xs"
                                >
                                  Booked
                                </Badge>
                              )}
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

          {/* Selected slot and booking button */}
          {scheduleId && selectedSchedule && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-semibold">Selected Time Slot</h4>
                  <p className="text-sm text-muted-foreground">
                    {`${getTimeIn12HourFormat(
                      selectedSchedule.schedule.startDateTime
                    )} - ${getTimeIn12HourFormat(
                      selectedSchedule.schedule.endDateTime
                    )}`}
                    <span className="ml-2">
                      ({dateFormatter(selectedSchedule.schedule.startDateTime)})
                    </span>
                  </p>
                  {!isSelectedSlotAvailable && (
                    <Badge variant="destructive" className="mt-1">
                      Slot no longer available
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={handleBookAppointment}
                  disabled={
                    !isSelectedSlotAvailable || isBooking || isProcessingPayment
                  }
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isBooking || isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm & Book Appointment"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DoctorScheduleSlots;
