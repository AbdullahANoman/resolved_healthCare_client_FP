"use client";

import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React, { useState } from "react";
import { Video, Calendar, User, Phone, DollarSign, Clock, FileText, Plus } from "lucide-react";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";
import { Button } from "@/components/ui/button";
import CreatePrescriptionModal from "@/components/prescriptions/createPrescriptionModal";
import { toast } from "sonner";

const PatientPrescriptionPage = () => {
  const { data, isLoading } = useGetMyAppointmentsQuery({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);


  console.log(selectedAppointment)

  const appointmentData = data?.appointments?.data || [];

  const appointmentPaidData = appointmentData?.filter((data: any) =>
    data.paymentStatus === "PAID"
  );

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

  // Check if appointment can have prescription
  const canCreatePrescription = (appointment: any) => {
    const isPaid = appointment.paymentStatus === "PAID";
    const isCompleted = appointment.status === "COMPLETED";
    const isScheduled = appointment.status === "SCHEDULED";
    const isUpcoming = new Date(appointment.schedule.startDateTime) <= new Date();
    
    // You can create prescription for completed or scheduled appointments that have started
    return isPaid && (isCompleted || (isScheduled && isUpcoming));
  };

  const handleCreatePrescription = (appointment: any) => {

    setSelectedAppointment(appointment);
    setIsModalOpen(true);
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
      accessorKey: "patient.name",
      header: "Patient Name",
      cell: ({ row }) => {
        const patient = row.original.patient;
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-sm">
                {patient?.name}
              </span>
              <span className="text-xs text-gray-600">Patient</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "patient.contactNumber",
      header: "Contact Number",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3 text-green-500" />
            <span className="text-sm text-gray-700">
              {row.original.patient.contactNumber || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "patient.email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-gray-700">
            {row.original.patient.email}
          </span>
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
              ৳{row?.original?.doctor?.appointmentFee}
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
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const appointment = row.original;
        const canJoin = appointment.status === "SCHEDULED" && 
                       appointment.paymentStatus === "PAID" &&
                       new Date(appointment.schedule.startDateTime) > new Date();
        const canCreate = canCreatePrescription(appointment);

        return (
          <div className="flex items-center space-x-2">
            {/* Join Button */}
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
                title={canJoin ? "Join Appointment" : "Cannot join appointment"}
              >
                <Video className="h-4 w-4" />
              </button>
            </Link>

            {/* Prescription Button */}
            <button
              onClick={() => handleCreatePrescription(appointment)}
            //   disabled={!canCreate}
              className={`p-2 rounded-md transition-colors duration-200 ${
                canCreate
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              title={
                canCreate 
                  ? "Create Prescription" 
                  : "Prescription can only be created for completed or ongoing appointments"
              }
            >
              <FileText className="h-4 w-4" />
            </button>
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

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header with Title and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Prescriptions</h1>
          <p className="text-gray-600 mt-1">
            Manage and create prescriptions for your patients
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Paid Appointments</p>
            <p className="text-xl font-semibold text-blue-700">
              {appointmentPaidData.length}
            </p>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={appointmentPaidData}
        columns={columns}
        tableName="Appointments"
        tableSubTitle="Select an appointment to create prescription"
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
          const canCreate = canCreatePrescription(rowData);
          
          return (
            <div className="space-y-3 min-w-[200px]">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm font-medium">Appointment Details</p>
                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                  Prescription: {canCreate ? "Allowed" : "Not Allowed"}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs ">Patient:</span>
                  <span className="text-xs font-medium">
                    {rowData?.patient?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Status:</span>
                  <span className="text-xs font-medium">
                    {rowData.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Payment:</span>
                  <span className="text-xs font-medium">
                    {rowData.paymentStatus}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-700 mb-1">Actions Available:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {canCreatePrescription(rowData) && (
                      <li className="flex items-center space-x-1">
                        <FileText className="h-3 w-3 text-green-600" />
                        <span>Create Prescription</span>
                      </li>
                    )}
                    {rowData.status === "SCHEDULED" && 
                     rowData.paymentStatus === "PAID" && 
                     new Date(rowData.schedule.startDateTime) > new Date() && (
                      <li className="flex items-center space-x-1">
                        <Video className="h-3 w-3 text-blue-600" />
                        <span>Join Video Call</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Create Prescription Modal */}
      {selectedAppointment && (
        <CreatePrescriptionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointmentId={selectedAppointment.id}
          patientId={selectedAppointment.patient.id}
          patientName={selectedAppointment.patient?.name}
          doctorId={selectedAppointment.doctorId}
        />
      )}
    </div>
  );
};

export default PatientPrescriptionPage;