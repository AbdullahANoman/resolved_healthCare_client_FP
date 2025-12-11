// app/(withCommonLayout)/doctors/[id]/page.tsx
"use client";

import { useGetDoctorQuery } from "@/redux/api/doctorApi";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  MapPin,
  Phone,
  Star,
  Users,
  Stethoscope,
  Shield,
  Heart,
  Brain,
  Eye,
  Activity,
  Check,
} from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import DoctorScheduleSlots from "@/components/Doctors/DoctorScheduleSlots";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const DoctorProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const { data: doctorData, isLoading, error } = useGetDoctorQuery(doctorId);

  if (isLoading || !doctorData) {
    return <DoctorProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto shadow-md border">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Doctor Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The doctor profile you are looking for does not exist.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="px-6"
                >
                  Go Back
                </Button>
                <Button
                  onClick={() => router.push("/doctors")}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
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

  const doctor = doctorData?.data || doctorData;
  const specialties =
    doctor?.doctorSpecialties?.map((ds: any) => ds.specialties?.title) || [];

  const getSpecialtyIcon = (specialty: string) => {
    const lowerSpecialty = specialty?.toLowerCase();
    if (lowerSpecialty?.includes("cardio") || lowerSpecialty?.includes("heart"))
      return <Heart className="h-3 w-3" />;
    if (lowerSpecialty?.includes("neuro") || lowerSpecialty?.includes("brain"))
      return <Brain className="h-3 w-3" />;
    if (lowerSpecialty?.includes("eye") || lowerSpecialty?.includes("vision"))
      return <Eye className="h-3 w-3" />;
    return <Activity className="h-3 w-3" />;
  };

  const rating = doctor.averageRating || 0;

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto shadow-md">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Profile Unavailable
              </h2>
              <Button
                onClick={() => router.push("/doctors")}
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                Browse All Doctors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<DoctorProfileSkeleton />}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-blue-50 px-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Back to Doctors</span>
          </Button>

          {/* Doctor Profile Header */}
          <Card className="mb-4 shadow-md border">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Doctor Image */}
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-blue-100">
                    <AvatarImage
                      src={doctor.profilePhoto || ""}
                      alt={doctor.name || "Doctor"}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {doctor.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "DR"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                    <Shield className="h-3 w-3" />
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {doctor.name}
                        </h1>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {doctor.gender}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {doctor.designation}
                      </p>

                      {/* Rating and Experience */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(rating)
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-gray-800 ml-1">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {doctor.experience || 0}+ Years Exp.
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2">
                        {specialties.slice(0, 3).map((specialty: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-xs py-1 px-2"
                          >
                            {getSpecialtyIcon(specialty)}
                            <span className="ml-1">{specialty}</span>
                          </Badge>
                        ))}
                        {specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Fee and Action */}
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                      <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-xl font-bold text-gray-900">
                            ৳{doctor.appointmentFee?.toLocaleString() || "0"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Consultation Fee</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Tabs */}
              <Card className="shadow-sm border">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full bg-gray-50 border-b">
                    <TabsTrigger value="overview" className="flex-1">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex-1">
                      Experience
                    </TabsTrigger>
                    <TabsTrigger value="qualifications" className="flex-1">
                      Qualifications
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          About Doctor
                        </h3>
                        <p className="text-gray-700 text-sm">
                          Dr. {doctor.name} is an experienced {doctor.designation?.toLowerCase()} 
                          with over {doctor.experience} years in {specialties.join(", ")}.
                        </p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Qualification</p>
                            <p className="font-medium text-sm">{doctor.qualification}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Registration</p>
                            <p className="font-medium text-sm">{doctor.registrationNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="font-medium text-sm">{doctor.contactNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-medium text-sm">{doctor.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="experience" className="p-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Professional Experience
                      </h3>
                      <div className="p-3 bg-blue-50 rounded border border-blue-100">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Current Position</h4>
                            <p className="text-sm text-gray-700">{doctor.designation}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">Present</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{doctor.currentWorkingPlace}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="qualifications" className="p-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Educational Background
                      </h3>
                      <div className="p-3 bg-green-50 rounded border border-green-100">
                        <h4 className="font-medium text-gray-900 mb-1">Medical Degree</h4>
                        <p className="text-sm text-gray-700">{doctor.qualification}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Working Place */}
              <Card className="shadow-sm border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Current Working Place
                      </h3>
                      <p className="text-sm text-gray-700 mb-2">
                        {doctor.currentWorkingPlace}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Typically responds within 2 hours</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Rating */}
              <Card className="shadow-sm border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Patient Rating</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">{rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">/5</span>
                    </div>
                  </div>
                  <Progress value={(rating / 5) * 100} className="h-1.5 mb-2" />
                  <p className="text-xs text-gray-500">Based on patient feedback</p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-sm border">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Experience</span>
                      </div>
                      <span className="font-medium text-sm">{doctor.experience || 0} Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">Patients</span>
                      </div>
                      <span className="font-medium text-sm">1.2K+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Success Rate</span>
                      </div>
                      <span className="font-medium text-sm">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-gray-700">Satisfaction</span>
                      </div>
                      <span className="font-medium text-sm">96%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="shadow-sm border border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Emergency Contact
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        Available 24/7 for emergencies
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-red-300 text-red-700 hover:bg-red-100 text-sm"
                      >
                        Call: {doctor.contactNumber}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Doctor Schedule Section */}
          {doctor.id && (
            <div className="mt-6">
              <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Time Slots
                </h2>
                <p className="text-sm text-gray-600">
                  Book your appointment at a convenient time
                </p>
              </div>
              <DoctorScheduleSlots id={doctor.id} />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

// Compact Skeleton
const DoctorProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-4">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Profile Card Skeleton */}
      <Card className="mb-4 border">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-36" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-16 w-32 rounded mb-2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        </div>
      </Card>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border">
            <div className="border-b">
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 flex-1 mx-2 my-1" />
                ))}
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </Card>
          <Card className="border">
            <div className="p-4">
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="border">
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
          </Card>
          <Card className="border">
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-32 mb-2" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </Card>
          <Card className="border">
            <div className="p-4">
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Skeleton */}
      <div className="mt-6 space-y-3">
        <div>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full rounded" />
      </div>
    </div>
  </div>
);

export default DoctorProfilePage;