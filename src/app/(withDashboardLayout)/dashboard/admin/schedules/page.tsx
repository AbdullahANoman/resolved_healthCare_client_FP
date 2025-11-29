// app/dashboard/admin/schedules/page.tsx
'use client';
import { useState } from 'react';
import { useGetAllSchedulesQuery, useDeleteScheduleMutation } from '@/redux/api/scheduleApi';
import { toast } from 'sonner';

// Shadcn/ui components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// DataTable components
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";

// Icons
import { Plus, Calendar, Trash2, AlertCircle, Clock, Edit3 } from 'lucide-react';
import ScheduleModal from './components/ScheduleModal';
import { dateFormatter } from '@/utils/dateFormatter';
import dayjs from 'dayjs';
import DeleteScheduleModal from './components/DeleteScheduleModal';

const SchedulesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<string>("");
  
  // Add pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Update the query to include pagination parameters
  const { data: allSchedules, isLoading, error, refetch } = useGetAllSchedulesQuery({
    page: pagination.pageIndex + 1, // Convert to 1-based for API
    limit: pagination.pageSize,
  });
  
  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation();
  
  const schedules = allSchedules?.schedules?.data || [];
  const meta = allSchedules?.schedules?.meta;

  console.log("Meta data:", meta);

  const handleDeleteClick = (scheduleId: string, scheduleDate: string) => {
    setSelectedScheduleId(scheduleId);
    setSelectedScheduleDate(scheduleDate);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedScheduleId) return;

    try {
      const res = await deleteSchedule(selectedScheduleId).unwrap();
      if (res?.id) {
        toast.success("Schedule deleted successfully!", {
          description: `Schedule for ${selectedScheduleDate} has been removed.`,
        });
        setDeleteModalOpen(false);
        setSelectedScheduleId(null);
        setSelectedScheduleDate("");
        refetch();
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to delete schedule", {
        description: err?.data?.message || "Please try again later.",
      });
    }
  };

  const handleScheduleCreated = () => {
    refetch();
  };



  // Handle pagination change
  const handlePaginationChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // Transform data for DataTable
  const tableData = schedules.map((schedule: any, index: number) => ({
    sl: (pagination.pageIndex * pagination.pageSize) + index + 1, // Calculate SL based on pagination
    id: schedule?.id,
    startDate: dateFormatter(schedule.startDateTime),
    endDate: dateFormatter(schedule.endDateTime),
    startTime: dayjs(schedule?.startDateTime).format('hh:mm a'),
    endTime: dayjs(schedule?.endDateTime).format('hh:mm a'),
    startDateTime: schedule.startDateTime,
    endDateTime: schedule.endDateTime,
    originalData: schedule,
  }));

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "sl",
      header: "SL",
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("sl")}
          </div>
        );
      },
      meta: {
        className: "w-[70px] text-center",
      },
    },
    {
      accessorKey: "startDate",
      header: "Date",
      cell: ({ row }) => {
        const startDate = row.getValue("startDate") as string;
        const endDate = row.getValue("endDate") as string;
        
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{startDate}</span>
              {startDate !== endDate && (
                <span className="text-xs text-muted-foreground">to {endDate}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-center text-green-700">
              {row.getValue("startTime")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center ">
            <Clock className="h-3 w-3 text-red-600" />
            <span className="text-sm font-medium text-red-700 text-center">
              {row.getValue("endTime")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const startTime = row.original.startDateTime;
        const endTime = row.original.endDateTime;
        const duration = dayjs(endTime).diff(dayjs(startTime), 'hour', true);
        
        return (
          <Badge variant="outline" className="text-xs">
            {duration.toFixed(1)} hours
          </Badge>
        );
      },
      meta: {
        className: "text-center",
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(schedule.id, schedule.startDate)}
              disabled={isDeleting}
              className="h-8 w-8 p-0 flex justify-center items-center hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
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

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading schedules. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Schedule Management</h1>
          <p className="text-muted-foreground">
            Manage and oversee all schedules and appointments
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-purple-700 hover:bg-purple-800"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          Create Schedule
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={tableData}
        columns={columns}
        tableName="All Schedules"
        tableSubTitle={`Showing ${schedules.length} of ${meta?.total || 0} schedules`}
        rowTooltipContent={(rowData) => {
          const duration = dayjs(rowData.endDateTime).diff(dayjs(rowData.startDateTime), 'hour', true);
          
          return (
            <div className="space-y-3 min-w-[250px]">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm font-medium">Schedule Details</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Start Date:</span>
                  <span className="text-xs font-medium text-center">{rowData.startDate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">End Date:</span>
                  <span className="text-xs font-medium">{rowData.endDate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Start Time:</span>
                  <span className="text-xs font-medium text-center">{rowData.startTime}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">End Time:</span>
                  <span className="text-xs font-medium text-center">{rowData.endTime}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Duration:</span>
                  <span className="text-xs font-medium">
                    {duration.toFixed(1)} hours
                  </span>
                </div>
              </div>
            </div>
          );
        }}
        // Add pagination props
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={meta ? Math.ceil(meta.total / meta.limit) : 1}
        totalItems={meta?.total || 0}
      />

      {/* Modals */}
      <ScheduleModal 
        open={isModalOpen} 
        setOpen={setIsModalOpen}
        onSuccess={handleScheduleCreated}
      />
      
      <DeleteScheduleModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        scheduleDate={selectedScheduleDate}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SchedulesPage;