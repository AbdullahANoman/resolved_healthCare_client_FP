"use client";
import { useState } from "react";
import { useDebounced } from "@/redux/hooks";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  CalendarDays,
  RefreshCw,
  Video,
  CheckCircle,
  Clock4,
  Filter,
  DollarSign,
  Check,
  X,
} from "lucide-react";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";
import { useGetMyScheduleQuery } from "@/redux/api/doctorScheduleApi";
import CreateScheduleModal from "./components/CreateScheduleModal";
import { IMeta } from "@/types/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduleResponse {
  data: any[];
  meta: any;
}


interface Schedule {
  id: string;
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  appointmentId: string | null;
  schedule: {
    id: string;
    startDateTime: string;
    endDateTime: string;
    createdAt: string;
    updatedAt: string;
  };
  appointment?: {
    id: string;
    status: string;
    paymentStatus: string;
    videoCallingId?: string;
  };
}

interface DoctorScheduleResponse {
  success: boolean;
  message: string;
  data: {
    data: Schedule[];
    meta: IMeta;
  };
}

const DoctorSchedulePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [isBookedFilter, setIsBookedFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [appointmentStatusFilter, setAppointmentStatusFilter] =
    useState<string>("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Build query parameters
  const buildQueryParams = () => {
    const params: any = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (isBookedFilter && isBookedFilter !== "all") {
      params["isBooked"] = isBookedFilter;
    }

    return params;
  };

const { data: scheduleDatas, isLoading, error, refetch } = useGetMyScheduleQuery(
  buildQueryParams()
) as {
  data: ScheduleResponse | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
};

const scheduleData = scheduleDatas?.data || [];
const meta = scheduleDatas?.meta;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePaginationChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  // Filter options - Use non-empty string values
  const bookingStatusOptions = [
    { value: "all", label: "All Booking Status" },
    { value: "true", label: "Booked" },
    { value: "false", label: "Available" },
  ];

  const paymentStatusOptions = [
    { value: "all", label: "All Payment Status" },
    { value: "PAID", label: "Paid" },
    { value: "UNPAID", label: "Unpaid" },
  ];

  const appointmentStatusOptions = [
    { value: "all", label: "All Appointment Status" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: "schedule.startDateTime",
      header: "Date & Time",
      cell: ({ row }) => {
        const schedule = row.original.schedule;
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {formatDate(schedule.startDateTime)}
              </span>
              <span className="text-xs text-gray-500">
                {getTimeRange(schedule.startDateTime, schedule.endDateTime)}
              </span>
            </div>
          </div>
        );
      },
      meta: {
        sticky: true,
        left: true,
        className: "sticky left-0 bg-white z-10 shadow-right",
      },
    },
    {
      accessorKey: "schedule.duration",
      header: "Duration",
      cell: ({ row }) => {
        const schedule = row.original.schedule;
        const start = new Date(schedule.startDateTime);
        const end = new Date(schedule.endDateTime);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60); // in minutes

        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">
              {Math.round(duration)} min
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "isBooked",
      header: "Booking Status",
      cell: ({ row }) => {
        const isBooked = row.getValue("isBooked") as boolean;
        const appointment = row.original.appointment;

        return (
          <Badge
            variant={isBooked ? "default" : "outline"}
            className={`
              text-xs font-medium
              ${
                isBooked
                  ? "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                  : "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
              }
            `}
          >
            {isBooked ? (
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Booked</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Clock4 className="h-3 w-3" />
                <span>Available</span>
              </div>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "appointment.paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        const appointment = row.original.appointment;
        const isBooked = row.original.isBooked;

        if (!isBooked || !appointment) {
          return <span className="text-sm text-gray-400 italic">N/A</span>;
        }

        return (
          <Badge
            variant="outline"
            className={`
              text-xs
              ${
                appointment.paymentStatus === "PAID"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }
            `}
          >
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span>{appointment.paymentStatus}</span>
            </div>
          </Badge>
        );
      },
    },
    {
      accessorKey: "appointment.status",
      header: "Appointment Status",
      cell: ({ row }) => {
        const appointment = row.original.appointment;
        const isBooked = row.original.isBooked;

        if (!isBooked || !appointment) {
          return <span className="text-sm text-gray-400 italic">N/A</span>;
        }

        return (
          <Badge
            variant="outline"
            className={`
              text-xs
              ${
                appointment.status === "COMPLETED"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : appointment.status === "CANCELLED"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }
            `}
          >
            {appointment.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "appointment",
      header: "Details",
      cell: ({ row }) => {
        const appointment = row.original.appointment;
        const isBooked = row.original.isBooked;

        if (!isBooked || !appointment) {
          return (
            <span className="text-sm text-gray-400 italic">No appointment</span>
          );
        }

        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {appointment.status}
              </Badge>
              <Badge
                variant="outline"
                className={`
                  text-xs
                  ${
                    appointment.paymentStatus === "PAID"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }
                `}
              >
                {appointment.paymentStatus}
              </Badge>
            </div>
            {appointment.videoCallingId && (
              <div className="flex items-center space-x-1">
                <Video className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-gray-600">Video call ready</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const schedule = row.original;
        const isBooked = schedule.isBooked;
        const appointment = schedule.appointment;

        return (
          <div className="flex items-center space-x-2">
            {isBooked ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.info("View appointment details", {
                      description: `Appointment ID: ${schedule.appointmentId}`,
                    });
                  }}
                  className="h-8 text-xs hover:bg-blue-50 hover:text-blue-700"
                >
                  View Details
                </Button>
                {appointment?.videoCallingId &&
                  appointment?.paymentStatus === "PAID" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        toast.success("Joining video call...", {
                          description: "Connecting to patient",
                        });
                      }}
                      className="h-8 text-xs bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Join Call
                    </Button>
                  )}
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="h-8 text-xs text-gray-400"
              >
                Available Slot
              </Button>
            )}
          </div>
        );
      },
      meta: {
        sticky: true,
        left: false,
        className: "sticky right-0 bg-white z-10 shadow-left",
      },
    },
  ];


  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setIsBookedFilter("all");
    setPaymentStatusFilter("all");
    setAppointmentStatusFilter("all");
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  // Check if any filter is active
  const isFilterActive =
    searchTerm ||
    dateFilter ||
    isBookedFilter !== "all" ||
    paymentStatusFilter !== "all" ||
    appointmentStatusFilter !== "all";

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">
            <CalendarDays className="h-12 w-12 mx-auto mb-3" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Error Loading Schedules
          </h3>
          <p className="text-muted-foreground mb-4">
            Unable to load schedule data. Please try again later.
          </p>
          <Button onClick={refetch} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground">
            Manage and view your appointment schedules and availability
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateScheduleModal refetch={refetch} />
          <Button
            variant="outline"
            onClick={() => {
              refetch();
              toast.success("Refreshing schedule data...");
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      {/* DataTable with Pagination */}
      <DataTable
        data={scheduleData}
        columns={columns}
        tableName="Schedule Overview"
        tableSubTitle="Your complete schedule with appointment details and availability"
        filters={[]}
        rowTooltipContent={(rowData: Schedule) => {
          const schedule = rowData.schedule;
          const appointment = rowData.appointment;

          return (
            <div className="space-y-3 min-w-[300px]">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm font-medium">Schedule Details</p>
                <Badge variant="outline" className="text-xs">
                  {rowData.isBooked ? "Booked" : "Available"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Date:</span>
                  <span className="text-xs font-medium">
                    {formatDate(schedule.startDateTime)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Time:</span>
                  <span className="text-xs font-medium">
                    {getTimeRange(schedule.startDateTime, schedule.endDateTime)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Duration:</span>
                  <span className="text-xs font-medium">
                    {(new Date(schedule.endDateTime).getTime() -
                      new Date(schedule.startDateTime).getTime()) /
                      (1000 * 60)}{" "}
                    min
                  </span>
                </div>

                {rowData.isBooked && appointment && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">
                          Appointment ID:
                        </span>
                        <span className="text-xs font-mono">
                          {rowData.appointmentId}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs font-medium">Status:</span>
                        <Badge variant="outline" className="text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs font-medium">Payment:</span>
                        <Badge
                          variant="outline"
                          className={`
                            text-xs
                            ${
                              appointment.paymentStatus === "PAID"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }
                          `}
                        >
                          {appointment.paymentStatus}
                        </Badge>
                      </div>
                      {appointment.videoCallingId && (
                        <div className="flex justify-between mt-1">
                          <span className="text-xs font-medium">
                            Video Call ID:
                          </span>
                          <span className="text-xs font-mono truncate max-w-[120px]">
                            {appointment.videoCallingId}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        }}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={meta ? Math.ceil(meta.total / meta.limit) : 1}
        totalItems={meta?.total || 0}
      />
    </div>
  );
};

export default DoctorSchedulePage;
