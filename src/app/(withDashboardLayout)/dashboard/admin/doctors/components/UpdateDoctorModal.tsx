/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import {
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "@/redux/api/doctorApi";
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi";
import { Gender } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  GraduationCap,
  Briefcase,
  DollarSign,
  Calendar,
  Building,
  Stethoscope,
  Loader2,
  X,
  Save,
  AlertCircle,
  HeartPulse,
  Search,
  Plus,
  Trash2,
} from "lucide-react";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  doctorId: string;
  onSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
};

type Specialty = {
  id: string;
  title: string;
  icon: string;
};

// Define Zod schema for validation
const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Please enter a valid contact number"),
  address: z.string().optional(),
  registrationNumber: z.string().min(1, "Registration number is required"),
  gender: z.enum(["MALE","FEMALE"], {
    required_error: "Gender is required",
  }),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience seems too high"),
  appointmentFee: z.coerce
    .number()
    .min(0, "Appointment fee cannot be negative"),
  qualification: z.string().min(1, "Qualification is required"),
  currentWorkingPlace: z
    .string()
    .min(1, "Current working place is required"),
  designation: z.string().min(1, "Designation is required"),
});

type FormData = z.infer<typeof doctorSchema>;

const UpdateDoctorModal = ({ open, setOpen, doctorId, onSuccess }: TProps) => {
  const router = useRouter();
  const { data, isLoading, error } = useGetDoctorQuery(doctorId);
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  // Fetch all specialties
  const { 
    data: specialtiesData, 
    isLoading: isSpecialtiesLoading 
  } = useGetAllSpecialtiesQuery({});

  // State for selected specialties and initial specialties
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [initialSpecialties, setInitialSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      gender: data?.gender, // Default value
    },
  });

  // Set form values when data is loaded
  useEffect(() => {
    if (data && open) {
      console.log("Setting form data:", data);
      
      // Reset form with doctor data
      reset({
        name: data?.name || "",
        contactNumber: data?.contactNumber || "",
        address: data?.address || "",
        registrationNumber: data?.registrationNumber || "",
        gender: data?.gender, // Ensure gender has a value
        experience: data?.experience || 0,
        appointmentFee: data?.appointmentFee || 0,
        qualification: data?.qualification || "",
        currentWorkingPlace: data?.currentWorkingPlace || "",
        designation: data?.designation || "",
      });

      if (data?.doctorSpecialties) {
        const doctorSpecialtyIds = data.doctorSpecialties.map(
          (ds: any) => ds.specialtiesId
        );
        console.log("Doctor specialties:", doctorSpecialtyIds);
        setSelectedSpecialties(doctorSpecialtyIds);
        setInitialSpecialties(doctorSpecialtyIds);
      }
    }
  }, [data, open, reset]);

  // Filter specialties based on search term
  const filteredSpecialties = (specialtiesData || []).filter(
    (specialty: Specialty) =>
      specialty.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add specialty to selected list
  const addSpecialty = () => {
    if (
      selectedSpecialtyId &&
      !selectedSpecialties.includes(selectedSpecialtyId)
    ) {
      setSelectedSpecialties((prev) => [...prev, selectedSpecialtyId]);
      setSelectedSpecialtyId(""); // Reset select
      setSearchTerm(""); // Reset search
    }
  };

  // Remove specialty from selected list
  const removeSpecialty = (specialtyId: string) => {
    setSelectedSpecialties((prev) => prev.filter((id) => id !== specialtyId));
  };

  const handleFormSubmit = async (values: FormData) => {
    try {
      // Validate at least one specialty is selected
      if (selectedSpecialties.length === 0) {
        toast.error("Please select at least one specialty");
        return;
      }

      // Determine which specialties are added vs removed
      const addedSpecialties = selectedSpecialties.filter(
        (specialtyId) => !initialSpecialties.includes(specialtyId)
      );

      const removedSpecialties = initialSpecialties.filter(
        (specialtyId) => !selectedSpecialties.includes(specialtyId)
      );

      // Prepare specialties payload
      const specialtiesPayload = [
        // Added specialties - isDeleted: false
        ...addedSpecialties.map((specialtyId) => ({
          specialtiesId: specialtyId,
          isDeleted: false,
        })),
        // Removed specialties - isDeleted: true
        ...removedSpecialties.map((specialtyId) => ({
          specialtiesId: specialtyId,
          isDeleted: true,
        })),
      ];

      const processedValues = {
        ...values,
        experience: Number(values.experience),
        appointmentFee: Number(values.appointmentFee),
        specialties: specialtiesPayload,
      };

      console.log("Submitting data:", processedValues);

      const res = await updateDoctor({
        id: doctorId,
        body: processedValues,
      }).unwrap();

      if (res?.id) {
        toast.success("Doctor Updated Successfully! 🎉", {
          description:
            "The doctor's information and specialties have been updated.",
        });
        handleClose();
        if (onSuccess) onSuccess(true);
        router.refresh();
      }
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error("Failed to update doctor", {
        description:
          err?.data?.message || "Please check the form and try again.",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedSpecialties([]);
    setInitialSpecialties([]);
    setSearchTerm("");
    setSelectedSpecialtyId("");
  };

  // Watch gender value for debugging
  const genderValue = watch("gender");
  console.log("Current gender value:", genderValue);

  if (error) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Doctor
            </DialogTitle>
            <DialogDescription>
              Unable to load doctor data. Please try again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Update Doctor Profile
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Update the doctors information, professional details, and
                  specialties
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600">Loading doctor information...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Current Info Badge */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Editing:</span>
                  <Badge variant="secondary" className="text-sm">
                    Dr. {data?.name}
                  </Badge>
                </div>
                <p className="text-sm text-blue-700">
                  Update the information below. All changes will be saved
                  immediately.
                </p>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="flex items-center gap-2 font-medium"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Dr. John Smith"
                    className={errors.name ? "border-red-500" : ""}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>


                <div className="space-y-2">
                  <Label
                    htmlFor="contactNumber"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Phone className="h-4 w-4 text-blue-600" />
                    Contact Number *
                  </Label>
                  <Input
                    id="contactNumber"
                    placeholder="+1 (555) 123-4567"
                    className={errors.contactNumber ? "border-red-500" : ""}
                    {...register("contactNumber")}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="flex items-center gap-2 font-medium"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    Gender *
                  </Label>
                  <Select
                    onValueChange={(value:any) => setValue("gender", value)}
                    value={watch("gender")}
                    defaultValue={data?.gender}
                  >
                    <SelectTrigger
                      className={errors.gender ? "border-red-500" : ""}
                      id="gender"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Gender).map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register("gender")}
                  />
                  {errors.gender && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 ">
                  <Label
                    htmlFor="address"
                    className="flex items-center gap-2 font-medium"
                  >
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Medical Street, City, State, ZIP Code"
                    {...register("address")}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="registrationNumber"
                    className="flex items-center gap-2 font-medium"
                  >
                    <IdCard className="h-4 w-4 text-green-600" />
                    Registration Number *
                  </Label>
                  <Input
                    id="registrationNumber"
                    placeholder="REG-12345"
                    className={
                      errors.registrationNumber ? "border-red-500" : ""
                    }
                    {...register("registrationNumber")}
                  />
                  {errors.registrationNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.registrationNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="experience"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Calendar className="h-4 w-4 text-green-600" />
                    Experience (Years) *
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="5"
                    className={errors.experience ? "border-red-500" : ""}
                    {...register("experience")}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="qualification"
                    className="flex items-center gap-2 font-medium"
                  >
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    Qualification *
                  </Label>
                  <Input
                    id="qualification"
                    placeholder="MBBS, MD, PhD"
                    className={errors.qualification ? "border-red-500" : ""}
                    {...register("qualification")}
                  />
                  {errors.qualification && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.qualification.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="designation"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    Designation *
                  </Label>
                  <Input
                    id="designation"
                    placeholder="Senior Consultant"
                    className={errors.designation ? "border-red-500" : ""}
                    {...register("designation")}
                  />
                  {errors.designation && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.designation.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="currentWorkingPlace"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Building className="h-4 w-4 text-green-600" />
                    Current Workplace *
                  </Label>
                  <Input
                    id="currentWorkingPlace"
                    placeholder="City General Hospital"
                    className={
                      errors.currentWorkingPlace ? "border-red-500" : ""
                    }
                    {...register("currentWorkingPlace")}
                  />
                  {errors.currentWorkingPlace && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.currentWorkingPlace.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="appointmentFee"
                    className="flex items-center gap-2 font-medium"
                  >
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Appointment Fee ($) *
                  </Label>
                  <Input
                    id="appointmentFee"
                    type="number"
                    min="0"
                    step="10"
                    placeholder="100"
                    className={errors.appointmentFee ? "border-red-500" : ""}
                    {...register("appointmentFee")}
                  />
                  {errors.appointmentFee && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.appointmentFee.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Specialties Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-purple-600" />
                Specialties *
              </h3>

              {isSpecialtiesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600 mr-2" />
                  <p className="text-gray-600">Loading specialties...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Search and Select Interface */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium">
                        Search and Select Specialty
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search specialties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                        <Select
                          value={selectedSpecialtyId}
                          onValueChange={setSelectedSpecialtyId}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {filteredSpecialties.map((specialty: Specialty) => (
                              <SelectItem
                                key={specialty.id}
                                value={specialty.id}
                                className="flex items-center gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={specialty.icon}
                                    alt={specialty.title}
                                    className="w-4 h-4 object-cover rounded"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/default-icon.png";
                                    }}
                                  />
                                  {specialty.title}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={addSpecialty}
                        disabled={!selectedSpecialtyId}
                        className="gap-2 w-full"
                      >
                        <Plus className="h-4 w-4" />
                        Add Specialty
                      </Button>
                    </div>
                  </div>

                  {/* Selected Specialties */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Selected Specialties ({selectedSpecialties.length})
                    </Label>

                    {selectedSpecialties.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                        <HeartPulse className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          No specialties selected. Use the search above to add
                          specialties.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                        {selectedSpecialties.map((specialtyId) => {
                          const specialty = specialtiesData?.find(
                            (s: Specialty) => s.id === specialtyId
                          );
                          return specialty ? (
                            <div
                              key={specialtyId}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={specialty.icon}
                                  alt={specialty.title}
                                  className="w-5 h-5 object-cover rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/default-icon.png";
                                  }}
                                />
                                <span className="text-sm font-medium">
                                  {specialty.title}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSpecialty(specialtyId)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedSpecialties.length === 0 && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  Please select at least one specialty
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isUpdating}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isUpdating || selectedSpecialties.length === 0}
                className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Doctor
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDoctorModal;