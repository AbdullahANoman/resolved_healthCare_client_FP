"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useGetMYProfileQuery,
  useUpdateMYProfileMutation,
} from "@/redux/api/myProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";
import ProfileUpdateModal from "./components/ProfileUpdateModal";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetMYProfileQuery(undefined);
  const [updateMYProfile, { isLoading: updating }] =
    useUpdateMYProfileMutation();

  const fileUploadHandler = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify({}));
    updateMYProfile(formData);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            My Profile
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your personal and professional information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-slate-200/50 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={data?.profilePhoto} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                        {data?.name?.charAt(0) || "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">
                      {data?.name}
                    </h3>
                    <p className="text-slate-600">{data?.designation}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {data?.role}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Status</span>
                      <Badge
                        variant={
                          data?.status === "active" ? "default" : "secondary"
                        }
                        className={
                          data?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                      >
                        {data?.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="ml-1 font-medium">
                          {data?.averageRating || "4.8"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-2 border-slate-200/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">Experience</p>
                    <p className="text-2xl font-bold">
                      {data?.experience || "5"} years
                    </p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">Fee</p>
                    <p className="text-2xl font-bold">
                      ${data?.apointmentFee || "150"}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="professional">
                  Professional Info
                </TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="border-2 border-slate-200/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem
                        icon={<Mail className="h-5 w-5" />}
                        label="Email"
                        value={data?.email}
                      />
                      <InfoItem
                        icon={<Phone className="h-5 w-5" />}
                        label="Contact"
                        value={data?.contactNumber}
                      />
                      <InfoItem
                        icon={<MapPin className="h-5 w-5" />}
                        label="Address"
                        value={data?.address}
                      />
                      <InfoItem
                        icon={null}
                        label="Gender"
                        value={data?.gender}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional">
                <Card className="border-2 border-slate-200/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem
                        icon={<GraduationCap className="h-5 w-5" />}
                        label="Qualification"
                        value={data?.qualification}
                      />
                      <InfoItem
                        icon={<Briefcase className="h-5 w-5" />}
                        label="Current Workplace"
                        value={data?.currentWorkingPlace}
                      />
                      <InfoItem
                        icon={<Award className="h-5 w-5" />}
                        label="Registration Number"
                        value={data?.registrationNumber}
                      />
                      <InfoItem
                        icon={<DollarSign className="h-5 w-5" />}
                        label="Appointment Fee"
                        value={`$${data?.apointmentFee}`}
                      />
                      <InfoItem
                        icon={<Clock className="h-5 w-5" />}
                        label="Experience"
                        value={`${data?.experience} years`}
                      />
                      <InfoItem
                        icon={<Star className="h-5 w-5" />}
                        label="Average Rating"
                        value={data?.averageRating}
                      />
                    </div>

                    {/* Specialties Section */}
                    {data?.specialties && (
                      <div className="mt-8">
                        <h4 className="font-semibold text-slate-900 mb-3">
                          Specialties
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {data.specialties.map(
                            (specialty: any, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="px-3 py-1"
                              >
                                {specialty}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card className="border-2 border-slate-200/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-slate-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>Schedule management coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Photo Upload Section */}
            <Card className="border-2 border-slate-200/50 shadow-sm">
              <CardHeader>
                <CardTitle>Update Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                      <AvatarImage src={data?.profilePhoto} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600">
                        {data?.name?.charAt(0) || "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm">Change</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="photo-upload"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          Upload new photo
                        </Label>
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) fileUploadHandler(file);
                          }}
                          disabled={updating}
                        />
                      </div>
                      <p className="text-sm text-slate-500">
                        Recommended: Square image, at least 400x400px. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      <ProfileUpdateModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        data={data}
      />
    </div>
  );
};

// Info Item Component
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="font-medium text-slate-900 mt-1">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

// Skeleton Loader
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  </div>
);

// Update Profile Modal Component


export default Profile;
