/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";

import useUserInfo from "@/hooks/useUserInfo";
import {
  useGetMYProfileQuery,
  useUpdateMYProfileMutation,
} from "@/redux/api/myProfile";
import { toast } from "sonner";

// Define validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  contactNumber: z.string().min(10, "Please enter a valid phone number"),
  // Email is not included in the schema since we don't want to update it
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const userInfo = useUserInfo();
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useGetMYProfileQuery(undefined);

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateMYProfileMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const profile = profileData || userInfo;

  // Initialize form with profile data
  useEffect(() => {
    if (profile && isEditModalOpen) {
      reset({
        name: profile.name || "",
        contactNumber: profile.contactNumber || "",
      });
      // Reset image preview to current profile photo
      setImagePreview(profile.profilePhoto || null);
      setSelectedFile(null);
      setIsImageChanged(false);
    }
  }, [profile, isEditModalOpen, reset]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB for base64 encoding)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please select an image smaller than 2MB",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please select an image file (JPEG, PNG, etc.)",
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setIsImageChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle image upload click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Convert image to base64 for JSON API
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      console.log("Updating profile with data:", data);
      
      // Prepare the data to send
      const updateData: any = {
        name: data.name,
        contactNumber: data.contactNumber,
      };

      // Handle image upload based on API requirement
      if (isImageChanged) {
        if (selectedFile) {
          // Convert image to base64 for JSON API
          try {
            const base64Image = await convertImageToBase64(selectedFile);
            updateData.profilePhoto = base64Image;
          } catch (error) {
            console.error("Failed to convert image to base64:", error);
            toast.error("Image Processing Error", {
              description: "Failed to process the selected image.",
            });
            return;
          }
        } else {
          // User removed the image - set to null or empty string
          updateData.profilePhoto = "";
        }
      }

      console.log("Update data being sent:", {
        name: updateData.name,
        contactNumber: updateData.contactNumber,
        hasProfilePhoto: !!updateData.profilePhoto,
        profilePhotoLength: updateData.profilePhoto?.length || 0,
      });

      const result = await updateProfile(updateData).unwrap();
      
      console.log("Update successful:", result);
      
      toast.success("Profile Updated Successfully!", {
        description: "Your profile information has been updated.",
      });
      
      refetch();
      setIsEditModalOpen(false);
      setSelectedFile(null);
      setImagePreview(null);
      setIsImageChanged(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      
      // Check for specific error messages
      let errorMessage = "Failed to update profile. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 400) {
        errorMessage = "Bad request. Please check your input data.";
      } else if (error?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (error?.status === 413) {
        errorMessage = "Image file is too large. Please select a smaller image.";
      } else if (error?.status === 415) {
        errorMessage = "Unsupported image format. Please use JPEG or PNG.";
      }
      
      toast.error("Update Failed", {
        description: errorMessage,
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={profile?.profilePhoto || ""} 
                    alt={profile?.name || "Profile"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {profile?.name?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl">{profile?.name}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {profile?.email}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <Shield className="h-4 w-4" />
                {profile?.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => setIsEditModalOpen(true)}
              variant="default"
              size="lg"
            >
              <Edit className="mr-2 h-5 w-5" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Full Name</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.name || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email Address</p>
                    <p className="text-sm text-muted-foreground break-all">
                      {profile?.email || "Not provided"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Read-only
                </Badge>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone Number</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.contactNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(profile?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Status */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    profile?.needsPasswordChange 
                      ? "bg-red-100" 
                      : "bg-green-100"
                  }`}>
                    {profile?.needsPasswordChange ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Password Status</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.needsPasswordChange
                        ? "Password change required"
                        : "Password is up to date"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    profile?.status === "ACTIVE" 
                      ? "default" 
                      : profile?.status === "BLOCKED" 
                      ? "destructive" 
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {profile?.status || "UNKNOWN"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your personal information and profile photo
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <div className="space-y-6 py-4">
              {/* Profile Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Profile Photo</Label>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">
                            {profile?.name?.charAt(0)?.toUpperCase() || "A"}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Change/Remove Image Buttons */}
                    <div className="absolute bottom-0 right-0 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUploadClick}
                        className="h-9 w-9 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      
                      {(imagePreview || profile?.profilePhoto) && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="h-9 w-9 p-0 rounded-full bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadClick}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {profile?.profilePhoto ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG up to 2MB. Recommended: 500x500px
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name Field */}
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
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

                {/* Email Field (Read-only) */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>

                {/* Phone Field */}
                <div className="grid gap-2">
                  <Label htmlFor="contactNumber" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="contactNumber"
                    placeholder="Enter your phone number"
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
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;