// app(withCommonLayout)/doctors/[id]/page.tsx
"use client";

import { useGetDoctorQuery } from "@/redux/api/doctorApi";
import { useParams, useRouter } from "next/navigation";


import {
  ArrowLeft,
  Award,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import DoctorScheduleSlots from "@/components/Doctors/DoctorScheduleSlots";
import { Badge } from "@/components/ui/badge";

const DoctorProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const { data: doctorData, isLoading, error } = useGetDoctorQuery(doctorId);

  console.log(doctorData, "doctorData");

  // Handle loading state
  if (isLoading || !doctorData) {
    return <DoctorProfileSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Doctor Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The doctor profile you are looking for does not exist or has
                been removed.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.back()} variant="outline">
                  Go Back
                </Button>
                <Button
                  onClick={() => router.push("/doctors")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse Doctors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  const doctor = doctorData; // Adjust based on your API response structure
  const specialties =
    doctor?.doctorSpecialties?.map((ds: any) => ds.specialties?.title) || [];

  // Additional safety check
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Doctor Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                Unable to load doctor profile.
              </p>
              <Button onClick={() => router.push("/doctors")}>
                Browse Doctors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<DoctorProfileSkeleton />}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </Button>

          {/* Doctor Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Doctor Image */}
                <div className="flex-shrink-0">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={doctor.profilePhoto || ""}
                      alt={doctor.name || "Doctor"}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                      {doctor.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "DR"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Doctor Info */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {doctor.name || "Unknown Doctor"}
                      </h1>
                      <p className="text-xl text-gray-600 font-medium mb-3">
                        {doctor.designation || "Medical Professional"}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {specialties.map((specialty: string, index: number) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 text-blue-700 border-blue-200 text-sm py-1 px-3"
                          >
                            {specialty}
                          </Badge>
                        ))}
                        {specialties.length === 0 && (
                          <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-sm py-1 px-3">
                            General Practice
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rating and Fee */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-bold text-yellow-700">
                          {(doctor.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="text-2xl font-bold text-gray-900">
                            ৳{doctor.appointmentFee || 0}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Consultation Fee
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-bold text-gray-900">
                        {doctor.experience || 0}+ Years
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Qualification</p>
                      <p className="font-bold text-gray-900 text-sm">
                        {doctor.qualification || "MBBS"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Phone className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-bold text-gray-900">
                        {doctor.contactNumber || "N/A"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <MapPin className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-bold text-gray-900 text-sm">
                        Available
                      </p>
                    </div>
                  </div>

                  {/* Working Place */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">
                        Current Working Place
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {doctor.currentWorkingPlace || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Schedule */}
          {doctor.id && <DoctorScheduleSlots id={doctor.id} />}
        </div>
      </div>
    </Suspense>
  );
};

// Skeleton component for loading state
const DoctorProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
    <div className="container mx-auto px-4">
      <Skeleton className="h-10 w-32 mb-6" />

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

export default DoctorProfilePage;
