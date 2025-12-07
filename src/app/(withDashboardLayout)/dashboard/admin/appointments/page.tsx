"use client";

import { useGetAllAppointmentsQuery, useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React, { useState } from "react";
import { Video, Calendar, MapPin, DollarSign, Clock } from "lucide-react";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";

const AdminAppointmentPage = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const buildQueryParams = () => {
    const params: any = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    return params;
  };
  const { data, isLoading } = useGetAllAppointmentsQuery(buildQueryParams());
  const appointmentData = data?.appointments || [];
  const meta = data?.meta;


  console.log(appointmentData);
  console.log(meta);


  // Format date utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time utility
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePaginationChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // Calculate days until appointment
  const calculateDaysUntilAppointment = (appointmentDate: string) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    const timeDiff = appointment.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining;
  };

  // Check if appointment can be joined
  const canJoinAppointment = (appointment: any) => {
    const isPaid = appointment.paymentStatus === "PAID";
    const isScheduled = appointment.status === "SCHEDULED";
    const isUpcoming =
      new Date(appointment.schedule.startDateTime) > new Date();
    return isPaid && isScheduled && isUpcoming;
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Appointment ID",
      cell: ({ row }) => {
        return (
          <button className="px-3 py-1 text-blue-600 hover:text-blue-800 bg-white hover:bg-gray-100 rounded-md border border-gray-300 transition-colors duration-200 text-xs font-medium">
            {row.original.id.slice(0, 8)}...
          </button>
        );
      },
      meta: {
        sticky: true,
        left: true,
        className: "sticky left-0 bg-white z-10 shadow-right",
      },
    },
    {
      accessorKey: "doctor.name",
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = row.original.doctor;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-sm">
              {doctor.name}
            </span>
            <span className="text-xs text-gray-600">{doctor.designation}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "doctor.qualification",
      header: "Qualification",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-gray-700">
            {row.original.doctor.qualification}
          </span>
        );
      },
    },
    {
      accessorKey: "doctor.currentWorkingPlace",
      header: "Hospital/Clinic",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-700">
              {row.original.doctor.currentWorkingPlace}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "schedule.startDateTime",
      header: "Appointment Date",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-blue-500" />
            <span className="text-sm font-medium">
              {formatDate(row.original.schedule.startDateTime)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "appointmentTime",
      header: "Time",
      cell: ({ row }) => {
        const startTime = formatTime(row.original.schedule.startDateTime);
        const endTime = formatTime(row.original.schedule.endDateTime);
        return (
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-green-500" />
            <span className="text-sm">
              {startTime} - {endTime}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "doctor.appointmentFee",
      header: "Fee",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-sm font-semibold">
              ৳{row.original.doctor.appointmentFee}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "SCHEDULED"
                ? "bg-blue-100 text-blue-800"
                : status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : status === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : status === "IN_PROGRESS"
                ? "bg-orange-100 text-orange-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status as React.ReactNode}
          </span>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const paymentStatus = row.getValue("paymentStatus");
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              paymentStatus === "PAID"
                ? "bg-green-100 text-green-800"
                : paymentStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : paymentStatus === "UNPAID"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {paymentStatus as React.ReactNode}
          </span>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Join",
      cell: ({ row }) => {
        const appointment = row.original;
        const canJoin = canJoinAppointment(appointment);

        return (
          <Link
            href={
              canJoin
                ? `/video?videoCallingId=${appointment.videoCallingId}`
                : "#"
            }
            passHref
          >
            <button
              disabled={!canJoin}
              className={`p-2 rounded-md transition-colors duration-200 ${
                canJoin
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Video className="h-4 w-4" />
            </button>
          </Link>
        );
      },
      meta: {
        sticky: true,
        left: false,
        className: "sticky right-0 bg-white z-10 shadow-left",
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div>
      <DataTable
        data={appointmentData}
        columns={columns}
        tableName="My Appointments"
        tableSubTitle="Manage and track your medical appointments"
        filters={[
          {
            columnId: "status",
            placeholder: "Filter by Status",
            options: [
              { value: "SCHEDULED", label: "Scheduled" },
              { value: "COMPLETED", label: "Completed" },
              { value: "CANCELLED", label: "Cancelled" },
              { value: "IN_PROGRESS", label: "In Progress" },
            ],
          },
          {
            columnId: "paymentStatus",
            placeholder: "Filter by Payment",
            options: [
              { value: "PAID", label: "Paid" },
              { value: "PENDING", label: "Pending" },
              { value: "UNPAID", label: "Unpaid" },
            ],
          },
        ]}
        rowTooltipContent={(rowData) => {
          const daysRemaining = calculateDaysUntilAppointment(
            rowData.schedule.startDateTime
          );
          const canJoin = canJoinAppointment(rowData);

          return (
            <div className="space-y-3 min-w-[200px]">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm font-medium">Appointment Details</p>
                {daysRemaining >= 0 && (
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {daysRemaining > 0
                      ? `In ${daysRemaining} day${
                          daysRemaining !== 1 ? "s" : ""
                        }`
                      : "Today"}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs ">Doctor:</span>
                  <span className="text-xs font-medium">
                    {rowData.doctor.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Time:</span>
                  <span className="text-xs font-medium">
                    {formatTime(rowData.schedule.startDateTime)} -{" "}
                    {formatTime(rowData.schedule.endDateTime)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Fee:</span>
                  <span className="text-xs font-medium">
                    ৳{rowData.doctor.appointmentFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Can Join:</span>
                  <span
                    className={`text-xs font-medium ${
                      canJoin ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {canJoin ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          );
        }}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={meta ? Math.ceil(meta.total / meta.limit) : 1}
        totalItems={meta?.total || 0}
      ></DataTable>
    </div>
  );
};

export default AdminAppointmentPage;
