// app/patient/prescriptions/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Calendar, User, FileText, Pill, Table } from "lucide-react";
import { useGetAllPrescriptionsQuery } from "@/redux/api/prescriptionApi";
import ViewPrescriptionButton from "./ViewPrescriptionButton";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";

const PatientPrescriptionsPage = () => {
  const { data, isLoading } = useGetAllPrescriptionsQuery({});
  
  const prescriptionData = data?.prescriptions || [];
  // Format date utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorFn: (_row, index) => index + 1,
      id: "slNo",
      header: "SL No",
      cell: ({ getValue }) => (
        <div className="text-center font-medium">{getValue() as React.ReactNode}</div>
      ),
    },
    {
      accessorKey: "doctor.name",
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = row.original.doctor;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-sm">{doctor.name}</span>
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
          <span className="text-sm text-gray-700">
            {row.original.doctor.currentWorkingPlace}
          </span>
        );
      },
    },
    {
      accessorKey: "instructions",
      header: "Instructions Preview",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600">
              {stripHtml(row.original.instructions)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "followUpDate",
      header: "Follow-up Date",
      cell: ({ row }) => {
        const followUpDate = row.original.followUpDate;
        if (!followUpDate) return <span className="text-sm text-gray-400">-</span>;
        
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-blue-500" />
            <span className="text-sm font-medium">
              {formatDate(followUpDate)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Prescribed On",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-gray-700">
            {formatDateTime(row.original.createdAt)}
          </span>
        );
      },
    },
    {
      accessorKey: "appointment.status",
      header: "Appointment Status",
      cell: ({ row }) => {
        const status = row.original.appointment.status;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : status === "SCHEDULED"
                ? "bg-blue-100 text-blue-800"
                : status === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <ViewPrescriptionButton data={row.original} />
          </div>
        );
      },
      meta: {
        sticky: true,
        right: true,
        className: "sticky right-0 bg-background z-100"
      },
    }
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50/30 ">
      <div className="">
        {/* Data Table Section */}
        <div className="w-full overflow-x-auto relative">
          <DataTable
            data={prescriptionData}
            columns={columns}
            tableName="Prescription History"
            tableSubTitle={`Showing ${prescriptionData.length} prescription(s)`}
            filters={[
              {
                columnId: "appointment.status",
                placeholder: "Filter by Status",
                options: [
                  { value: "COMPLETED", label: "Completed" },
                  { value: "SCHEDULED", label: "Scheduled" },
                  { value: "CANCELLED", label: "Cancelled" },
                ],
              },
              {
                columnId: "doctor.currentWorkingPlace",
                placeholder: "Filter by Hospital",
                options: Array.from(
                  new Set(prescriptionData.map((p: any) => p.doctor.currentWorkingPlace))
                ).map((hospital: any) => ({
                  value: hospital,
                  label: hospital,
                })),
              },
            ]}
            rowTooltipContent={(rowData) => {
              return (
                <div className="space-y-2 min-w-[200px]">
                  <div className="font-semibold text-white border-b border-white/30 pb-1">
                    Prescription Summary
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Doctor:</span>
                      <span className="text-white">{rowData.doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Date:</span>
                      <span className="text-white">{formatDate(rowData.createdAt)}</span>
                    </div>
                    {rowData.followUpDate && (
                      <div className="flex justify-between">
                        <span className="text-white/80">Follow-up:</span>
                        <span className="text-white">{formatDate(rowData.followUpDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* Empty State */}
        {!isLoading && prescriptionData.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Prescriptions Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                You do not have any prescriptions yet. Your prescriptions will appear here after your appointments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptionsPage;