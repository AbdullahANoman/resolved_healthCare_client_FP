"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDoctorMutation } from "@/redux/api/doctorApi";
import { Gender } from "@/types/common";
import { modifyPayload } from "@/utils/modifyPayload";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building,
  Calendar,
  Camera,
  CheckCircle2,
  DollarSign,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  Upload,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  doctor: {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    gender: string;
    experience: number;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    profilePhoto: string;
  };
  password: string;
  file: File | null;
};

type FormDataSnapshot = Partial<{
  doctor: Partial<FormData["doctor"]>;
  password: string;
  file: File | null;
}>;

const CreateDoctorModal = ({ open, setOpen }: TProps) => {
  const [createDoctor, { isLoading }] = useCreateDoctorMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormDataSnapshot>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
    control,
  } = useForm<FormData>({
    defaultValues: {
      doctor: {
        name: "",
        email: "",
        contactNumber: "",
        address: "",
        registrationNumber: "",
        gender: "",
        experience: 0,
        appointmentFee: 0,
        qualification: "",
        currentWorkingPlace: "",
        designation: "",
        profilePhoto: "",
      },
      password: "",
      file: null,
    },
  });

  // Watch all form values for real-time updates
  const formValues = useWatch({ control });

  const steps = [
    {
      label: "Personal Info",
      icon: User,
      description: "Basic personal details and profile photo",
      fields: ["name", "email", "contactNumber", "gender", "address", "file"],
    },
    {
      label: "Professional Details",
      icon: Briefcase,
      description: "Professional qualifications",
      fields: [
        "registrationNumber",
        "experience",
        "qualification",
        "designation",
        "currentWorkingPlace",
        "appointmentFee",
      ],
    },
    {
      label: "Account Setup",
      icon: Lock,
      description: "Security and finalization",
      fields: ["password"],
    },
  ];

  // Calculate progress percentage
  const progress = ((activeStep + 1) / steps.length) * 100;

  // Save form data when moving between steps
  useEffect(() => {
    if (formValues) {
      setFormData(formValues);
    }
  }, [formValues]);

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload JPEG, JPG, PNG, or WebP images only.",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setValue("file", file);
      setValue("doctor.profilePhoto", URL.createObjectURL(file)); // Temporary URL for display
      setIsUploading(false);
      toast.success("Image uploaded successfully!", {
        description: "Profile photo has been added.",
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Upload failed", {
        description: "Failed to read the image file.",
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("file", null);
    setValue("doctor.profilePhoto", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = async (values: FormData) => {
    try {
      // Check if image is required but not uploaded
      if (!values.file && activeStep >= 0) {
        toast.error("Profile photo required", {
          description: "Please upload a profile photo for the doctor.",
        });
        setActiveStep(0); // Go back to first step
        return;
      }

      // Merge with any unsaved form data
      const finalData = { ...formData, ...values };

      const processedValues = {
        doctor: {
          ...finalData.doctor,
          experience: Number(finalData.doctor?.experience) || 0,
          appointmentFee: Number(finalData.doctor?.appointmentFee) || 0,
        },
        password: finalData.password || "",
        file: finalData.file || null,
      };

      console.log(processedValues,'processed values')

      const data = modifyPayload(processedValues);


      console.log(data,'modified data');

      const res = await createDoctor(data).unwrap();

      console.log(res)

      if (res.status == 200) {
        toast.success("Doctor created successfully! 🎉", {
          description:
            "The doctor has been added to the system and can now log in.",
        });
        handleClose();
      }
    } catch (err: any) {
      console.error("Creation error:", err);
      toast.error("Failed to create doctor", {
        description:
          err?.data?.message || "Please check the form and try again.",
      });
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    const stepFields = steps[step].fields.map((field) => {
      if (field === "password") return "password";
      if (field === "file") return "file";
      return `doctor.${field}`;
    });

    const isValid = await trigger(stepFields as any);

    if (!isValid) {
      toast.error("Please fix the errors before continuing", {
        description: "Some fields require your attention.",
      });
    }

    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setShowPassword(false);
    setImagePreview(null);
    setFormData({});
    reset();
    // Clean up object URLs
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };



  const renderStepContent = (step: number) => {
    const StepIcon = steps[step].icon;

    return (
      <div className="space-y-6">
        {/* Form Content */}
        <div className="space-y-4">
          {step === 0 && (
            <div className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      {imagePreview ? (
                        <AvatarImage
                          src={imagePreview}
                          alt="Profile preview"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Profile Photo
                    </p>
                    <p className="text-xs text-gray-500 max-w-sm">
                      Upload a professional headshot. JPG, PNG, or WebP. Max
                      5MB.
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                    />

                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                        disabled={isUploading}
                        className="gap-2"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {isUploading ? "Uploading..." : "Choose Image"}
                      </Button>

                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {!imagePreview && (
                      <p className="text-xs text-red-600 flex items-center justify-center gap-1">
                        <X className="h-3 w-3" />
                        Profile photo is required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information Form */}
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
                    className={errors.doctor?.name ? "border-red-500" : ""}
                    {...register("doctor.name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.doctor?.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.doctor.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    className={errors.doctor?.email ? "border-red-500" : ""}
                    {...register("doctor.email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.doctor?.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.doctor.email.message}
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
                    className={
                      errors.doctor?.contactNumber ? "border-red-500" : ""
                    }
                    {...register("doctor.contactNumber", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[+]?[0-9\s\-()]{10,}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                  />
                  {errors.doctor?.contactNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.doctor.contactNumber.message}
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
                    onValueChange={(value) => setValue("doctor.gender", value)}
                    value={watch("doctor.gender")}
                  >
                    <SelectTrigger
                      className={errors.doctor?.gender ? "border-red-500" : ""}
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
                  {errors.doctor?.gender && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.doctor.gender.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
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
                    {...register("doctor.address")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Steps 1 and 2 remain the same as previous implementation */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... Professional Details fields (same as before) ... */}
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
                    errors.doctor?.registrationNumber ? "border-red-500" : ""
                  }
                  {...register("doctor.registrationNumber", {
                    required: "Registration number is required",
                  })}
                />
                {errors.doctor?.registrationNumber && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.doctor.registrationNumber.message}
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
                  className={errors.doctor?.experience ? "border-red-500" : ""}
                  {...register("doctor.experience", {
                    required: "Experience is required",
                    min: { value: 0, message: "Experience cannot be negative" },
                    max: { value: 50, message: "Experience seems too high" },
                  })}
                />
                {errors.doctor?.experience && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.doctor.experience.message}
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
                  className={
                    errors.doctor?.qualification ? "border-red-500" : ""
                  }
                  {...register("doctor.qualification", {
                    required: "Qualification is required",
                  })}
                />
                {errors.doctor?.qualification && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.doctor.qualification.message}
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
                  className={errors.doctor?.designation ? "border-red-500" : ""}
                  {...register("doctor.designation", {
                    required: "Designation is required",
                  })}
                />
                {errors.doctor?.designation && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.doctor.designation.message}
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
                    errors.doctor?.currentWorkingPlace ? "border-red-500" : ""
                  }
                  {...register("doctor.currentWorkingPlace", {
                    required: "Current workplace is required",
                  })}
                />
                {errors.doctor?.currentWorkingPlace && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.doctor.currentWorkingPlace.message}
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
                  className={
                    errors.doctor?.appointmentFee ? "border-red-500" : ""
                  }
                  {...register("doctor.appointmentFee", {
                    required: "Appointment fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                />
                {errors.doctor?.appointmentFee && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.doctor.appointmentFee.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 font-medium"
                  >
                    <Lock className="h-4 w-4 text-purple-600" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      className={
                        errors.password ? "border-red-500 pr-10" : "pr-10"
                      }
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: "Include uppercase, lowercase, and numbers",
                        },
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Password Strength Tips */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Password Requirements
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• At least 6 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Review Card with Profile Photo */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">
                      Review Information
                    </h4>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Photo Preview */}
                    <div className="flex-shrink-0">
                      <div className="text-center">
                        <Avatar className="w-20 h-20 border-2 border-gray-200 mx-auto">
                          {imagePreview ? (
                            <AvatarImage
                              src={imagePreview}
                              alt="Profile preview"
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <User className="h-8 w-8" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <p className="text-xs text-gray-500 mt-2">
                          Profile Photo
                        </p>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm flex-1">
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <p className="font-medium">
                            {watch("doctor.name") || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p className="font-medium">
                            {watch("doctor.email") || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Contact:</span>
                          <p className="font-medium">
                            {watch("doctor.contactNumber") || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Gender:</span>
                          <p className="font-medium">
                            {watch("doctor.gender") || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600">Qualification:</span>
                          <p className="font-medium">
                            {watch("doctor.qualification") || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Designation:</span>
                          <p className="font-medium">
                            {watch("doctor.designation") || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Experience:</span>
                          <p className="font-medium">
                            {watch("doctor.experience") || "0"} years
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Fee:</span>
                          <p className="font-medium">
                            ${watch("doctor.appointmentFee") || "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      All information looks good! The doctor will receive login
                      credentials via email.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Add New Doctor
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Complete the form to register a new medical professional
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={`flex-1 h-1 ${
                      index <= activeStep ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Step circle */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                    index === activeStep
                      ? "bg-blue-500 border-blue-500 text-white scale-110"
                      : index < activeStep
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 text-gray-500 bg-white"
                  }`}
                >
                  {index < activeStep ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      index < activeStep ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Step label */}
              <span
                className={`text-xs mt-2 font-medium ${
                  index === activeStep ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="min-h-[500px]">{renderStepContent(activeStep)}</div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex-1">
              {activeStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="gap-2 min-w-[100px]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex-1 flex justify-end">
              {activeStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="gap-2 min-w-[120px] bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !imagePreview}
                  className="gap-2 min-w-[140px] bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Create Doctor
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDoctorModal;
