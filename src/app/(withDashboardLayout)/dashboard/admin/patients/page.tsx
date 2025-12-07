"use client";
import { useState } from "react";
import { useDebounced } from "@/redux/hooks";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Trash2,
  Users,
  Plus,
  FileText,
  Stethoscope,
} from "lucide-react";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";
import {
  useGetAllPatientsQuery,
  useSoftDeletePatientMutation,
} from "@/redux/api/patientApi";
import SimpleDeleteModal from "./components/SimpleDeleteModal";

const PatientsPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  const query: Record<string, any> = {};
  if (!!debouncedTerm) {
    query["searchTerm"] = searchTerm;
  }

  const handleDeleteClick = (patientId: string, patientName: string) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setDeleteModalOpen(true);
  };

    const handleDeleteConfirm = async () => {
    if (!selectedPatientId) return;

    try {
      const res = await deletePatient(selectedPatientId).unwrap();
      if (res?.id) {
        toast.success("Patient deleted successfully!", {
          description: `${selectedPatientName} has been removed from the system.`,
        });
        setDeleteModalOpen(false);
        setSelectedPatientId(null);
        setSelectedPatientName("");
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to delete patient", {
        description: err?.data?.message || "Please try again later.",
      });
    }
  };

  const { data, isLoading, error } = useGetAllPatientsQuery({ ...query });
  const [deletePatient, { isLoading: isDeleting }] =
    useSoftDeletePatientMutation();

  const patients = data?.patients || [];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-green-100">
              <AvatarImage src={patient.profilePhoto} alt={patient.name} />
              <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                {patient.name?.charAt(0).toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm">
                {patient.name}
              </span>
              <span className="text-xs text-gray-500">Patient</span>
              <div className="flex items-center space-x-1 mt-1">
                <FileText className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-gray-600">
                  {patient.medicalReport?.length || 0} reports
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
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue("address") as string;
        return (
          <div className="flex items-center space-x-2 max-w-[150px]">
            <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate" title={address}>
              {address || "No address"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "patientHealthData",
      header: "Health Data",
      cell: ({ row }) => {
        const healthData = row.getValue("patientHealthData");
        return (
          <Badge
            variant="outline"
            className={`
              text-xs font-medium
              ${
                healthData
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }
            `}
          >
            {healthData ? "Available" : "Not Available"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "medicalReport",
      header: "Medical Reports",
      cell: ({ row }) => {
        const reports = row.getValue("medicalReport") as any[];
        return (
          <div className="flex items-center space-x-2">
            <FileText className="h-3 w-3 text-blue-500" />
            <span className="text-sm text-gray-700">
              {reports?.length || 0}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Registered",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        const date = new Date(createdAt).toLocaleDateString();
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 text-blue-500" />
            <span className="text-sm text-gray-700">{date}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(patient.id, patient.name)}
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

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">
            <Users className="h-12 w-12 mx-auto mb-3" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Patients</h3>
          <p className="text-muted-foreground">
            Unable to load patients data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* DataTable */}
      <DataTable
        data={patients}
        columns={columns}
        tableName="All Patients"
        tableSubTitle="Comprehensive list of all registered patients"
        filters={[
          {
            columnId: "patientHealthData",
            placeholder: "Filter by Health Data",
            options: [
              { value: "available", label: "With Health Data" },
              { value: "not-available", label: "Without Health Data" },
            ],
          },
        ]}
        rowTooltipContent={(rowData) => {
          const reports = rowData.medicalReport || [];
          const healthData = rowData.patientHealthData;

          return (
            <div className="space-y-3 min-w-[280px]">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm font-medium">Patient Details</p>
                <Badge variant="outline" className="text-xs">
                  ID: {rowData.id.slice(0, 8)}...
                </Badge>
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
                  <span className="text-xs">Address:</span>
                  <span className="text-xs font-medium max-w-[150px] truncate">
                    {rowData.address || "No address"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Health Data:</span>
                  <Badge
                    variant="outline"
                    className={`
                      text-xs
                      ${
                        healthData
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }
                    `}
                  >
                    {healthData ? "Available" : "Not Available"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Medical Reports:</span>
                  <span className="text-xs font-medium">
                    {reports.length} reports
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs">Registered:</span>
                  <span className="text-xs font-medium">
                    {new Date(rowData.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {healthData && (
                  <div className="mt-2 pt-2 border-t">
                    <span className="text-xs font-medium text-green-700">
                      Health Data Available
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      Patient has complete health profile and medical history.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      >
      </DataTable>
      <SimpleDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        description={`Are you sure you want to delete ${selectedPatientName}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PatientsPage;
