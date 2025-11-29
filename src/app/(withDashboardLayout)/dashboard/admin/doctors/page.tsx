"use client";
import { useState } from "react";
import {
  useDeleteDoctorMutation,
  useGetAllDoctorsQuery,
} from "@/redux/api/doctorApi";
import { useDebounced } from "@/redux/hooks";
import { toast } from "sonner";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Edit3,
  Trash2,
  Stethoscope,
  Plus,
  Star,
} from "lucide-react";
import DeleteDoctorModal from "./components/DeleteDoctorModal";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";
import CreateDoctorModal from "./components/CreateDoctorModal";
import UpdateDoctorModal from "./components/UpdateDoctorModal";

const DoctorsPage = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Add pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleEditClick = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (doctorId: string, doctorName: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName(doctorName);
    setDeleteModalOpen(true);
  };

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  const handleDeleteConfirm = async () => {
    if (!selectedDoctorId) return;

    try {
      const res = await deleteDoctor(selectedDoctorId).unwrap();
      if (res?.id) {
        toast.success("Doctor deleted successfully!", {
          description: `Dr. ${selectedDoctorName} has been removed from the system.`,
        });
        setDeleteModalOpen(false);
        setSelectedDoctorId(null);
        setSelectedDoctorName("");
        refetch(); // Refresh data after deletion
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to delete doctor", {
        description: err?.data?.message || "Please try again later.",
      });
    }
  };

  // Update query to include pagination
  const query: Record<string, any> = {
    page: pagination.pageIndex + 1, // Convert to 1-based for API
    limit: pagination.pageSize,
  };

  if (!!debouncedTerm) {
    query["searchTerm"] = searchTerm;
  }

  const { data, isLoading, error, refetch } = useGetAllDoctorsQuery({ ...query });
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();

  const doctors = data?.doctors || [];
  const meta = data?.meta;

  // Handle pagination change
  const handlePaginationChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // Extract unique specialties for filter options
  const specialtyOptions = Array.from(
    new Set<string>(
      doctors.flatMap(
        (doctor: any) =>
          doctor.doctorSpecialties?.map((ds: any) => ds.specialties.title) || []
      )
    )
  )
    .filter(Boolean)
    .map((specialty: string) => ({
      value: specialty,
      label: specialty,
    }));

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-blue-100">
              <AvatarImage src={doctor.profilePhoto} alt={doctor.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {doctor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm">
                {doctor.name}
              </span>
              <span className="text-xs text-gray-500">
                {doctor.designation || "Medical Professional"}
              </span>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">
                  {doctor.averageRating || "No ratings"}
                </span>
              </div>
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
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-700">
              {row.getValue("email")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "contactNumber",
      header: "Contact",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-700">
              {row.getValue("contactNumber")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string;
        return (
          <Badge
            variant="outline"
            className={`
              text-xs font-medium
              ${
                gender === "MALE"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : ""
              }
              ${
                gender === "FEMALE"
                  ? "bg-pink-50 text-pink-700 border-pink-200"
                  : ""
              }
            `}
          >
            {gender}
          </Badge>
        );
      },
    },
    {
      accessorKey: "appointmentFee",
      header: "Fee",
      cell: ({ row }) => {
        const fee = row.getValue("appointmentFee") as number;
        return (
          <div className="flex items-center space-x-2">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-sm font-semibold text-green-700">${fee}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "doctorSpecialties",
      header: "Specialties",
      cell: ({ row }) => {
        const doctorSpecialties = row.getValue("doctorSpecialties") as any[];
        const specialties =
          doctorSpecialties?.map((ds) => ds.specialties) || [];

        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {specialties.slice(0, 2).map((specialty: any, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty.title}
              </Badge>
            ))}
            {specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{specialties.length - 2} more
              </Badge>
            )}
            {specialties.length === 0 && (
              <span className="text-xs text-gray-400">No specialties</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => {
        const experience = row.getValue("experience") as number;
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 text-blue-500" />
            <span className="text-sm text-gray-700">
              {experience || 0} years
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(doctor.id)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(doctor.id, doctor.name)}
              disabled={isDeleting}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700"
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

  // Handle doctor creation success
  const handleDoctorCreated = () => {
    refetch();
    setIsModalOpen(false);
  };

  // Handle doctor update success
  const handleDoctorUpdated = () => {
    refetch();
    setUpdateModalOpen(false);
    setSelectedDoctorId(null);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">
            <Stethoscope className="h-12 w-12 mx-auto mb-3" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Doctors</h3>
          <p className="text-muted-foreground">
            Unable to load doctors data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Doctors Management
          </h1>
          <p className="text-muted-foreground">
            Manage and oversee all medical professionals in the system
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-purple-700 hover:bg-purple-800"
        >
          <Plus className="h-4 w-4" />
          Add New Doctor
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={doctors}
        columns={columns}
        tableName="All Doctors"
        tableSubTitle={`Showing ${doctors.length} of ${meta?.total || 0} doctors`}
        filters={[
          {
            columnId: "gender",
            placeholder: "Filter by Gender",
            options: [
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ],
          },
          {
            columnId: "doctorSpecialties",
            placeholder: "Filter by Specialty",
            options: specialtyOptions,
          },
        ]}
        rowTooltipContent={(rowData) => {
          const specialties =
            rowData.doctorSpecialties?.map((ds: any) => ds.specialties.title) ||
            [];

          return (
            <div className="space-y-3 min-w-[250px]">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm font-medium">Doctor Details</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Name:</span>
                  <span className="text-xs font-medium">{rowData.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Email:</span>
                  <span className="text-xs font-medium">{rowData.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Contact:</span>
                  <span className="text-xs font-medium">
                    {rowData.contactNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Fee:</span>
                  <span className="text-xs font-medium">
                    ${rowData.appointmentFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Experience:</span>
                  <span className="text-xs font-medium">
                    {rowData.experience || 0} years
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Rating:</span>
                  <span className="text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                    {rowData.averageRating || "No ratings"}
                  </span>
                </div>

                {specialties.length > 0 && (
                  <div>
                    <span className="text-xs block mb-1">Specialties:</span>
                    <div className="flex flex-wrap gap-1">
                      {specialties.map((specialty: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
        // Add pagination props
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={meta ? Math.ceil(meta.total / meta.limit) : 1}
        totalItems={meta?.total || 0}
      >
        {/* Additional children can be added here */}
      </DataTable>

      {/* Modals */}
      <CreateDoctorModal 
        open={isModalOpen} 
        setOpen={setIsModalOpen}
        onSuccess={handleDoctorCreated}
      />
      
      {selectedDoctorId && (
        <UpdateDoctorModal
          open={updateModalOpen}
          setOpen={setUpdateModalOpen}
          doctorId={selectedDoctorId}
          onSuccess={handleDoctorUpdated}
        />
      )}

      <DeleteDoctorModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        doctorName={selectedDoctorName}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DoctorsPage;