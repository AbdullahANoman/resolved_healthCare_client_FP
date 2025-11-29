"use client";
import { Suspense } from "react";
export interface Doctor {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE";
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  doctorSpecialties: DoctorSpecialty[];
}

export interface DoctorSpecialty {
  specialtiesId: string;
  doctorId: string;
  specialties: Specialty;
}

export interface Specialty {
  id: string;
  title: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useGetAllDoctorsQuery,
  useGetDoctorSpecialtiesQuery,
} from "@/redux/api/doctorApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Users, Star, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScrollCategory from "@/components/Doctors/ScrollCategory";
import DoctorCard from "@/components/Doctors/DoctorCard";

const DoctorsPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const specialties = searchParams.get("specialties") || "";
  const search = searchParams.get("search") || "";

  // Fetch doctors with specialties filter
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetAllDoctorsQuery({
    specialties: specialties || undefined,
    searchTerm: search || undefined,
    limit: 20,
    page: 1,
  });

  // Fetch all specialties for the category scroll
  const { data: specialtiesData, isLoading: specialtiesLoading } =
    useGetDoctorSpecialtiesQuery(undefined);

  const doctors = doctorsData?.doctors || [];
  const specialtiesList = specialtiesData || [];

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    router.push(`/doctors?${params.toString()}`);
  };

  // Handle specialty filter
  const handleSpecialtyChange = (specialty: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (specialty) {
      params.set("specialties", specialty);
    } else {
      params.delete("specialties");
    }

    router.push(`/doctors?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    router.push("/doctors");
    setSearchTerm("");
  };

  // Calculate statistics
  const stats = {
    total: doctors.length,
    available: doctors.filter((d: { isDeleted: any }) => !d.isDeleted).length,
    averageRating:
      doctors.reduce((acc: any, doctor: any) => acc + doctor.averageRating, 0) /
        doctors.length || 0,
  };

  if (doctorsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Failed to Load Doctors
              </h2>
              <p className="text-gray-600 mb-4">
                There was an error loading the doctors list. Please try again.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Specialist Doctor
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with experienced healthcare professionals for personalized
              medical care
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search doctors by name, qualification, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-20 h-12 text-base"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 h-10 bg-blue-600 hover:bg-blue-700"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Doctors</p>
                  <p className="text-xl font-bold text-gray-900">
                    {doctorsLoading ? "..." : stats.total}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-xl font-bold text-gray-900">
                    {doctorsLoading ? "..." : stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Available Now</p>
                  <p className="text-xl font-bold text-gray-900">
                    {doctorsLoading ? "..." : stats.available}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>

                {/* Specialties Filter */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Specialties
                  </h4>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    <Button
                      variant={!specialties ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSpecialtyChange("")}
                    >
                      All Specialties
                    </Button>
                    {specialtiesLoading ? (
                      <div className="space-y-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-8 w-full" />
                        ))}
                      </div>
                    ) : (
                      specialtiesList.map((specialty: any) => (
                        <Button
                          key={specialty.id}
                          variant={
                            specialties === specialty.title
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleSpecialtyChange(specialty.title)}
                        >
                          {specialty.title}
                        </Button>
                      ))
                    )}
                  </div>
                </div>

                {/* Active Filters */}
                {(specialties || search) && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">
                        Active Filters
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {specialties && (
                        <div className="flex items-center justify-between text-sm bg-blue-50 px-2 py-1 rounded">
                          <span>Specialty: {specialties}</span>
                        </div>
                      )}
                      {search && (
                        <div className="flex items-center justify-between text-sm bg-green-50 px-2 py-1 rounded">
                          <span>Search: {search}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Category Scroll */}
            <ScrollCategory
              specialties={specialties}
              onSpecialtyChange={handleSpecialtyChange}
              isLoading={specialtiesLoading}
              specialtiesList={specialtiesList}
            />

            {/* Doctors List */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {specialties ? `${specialties} Specialists` : "All Doctors"}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({doctors.length} doctors found)
                    </span>
                  </h2>
                </div>

                {doctorsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : doctors.length > 0 ? (
                  <div className="space-y-4">
                    {doctors.map((doctor: any) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Doctors Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {specialties || search
                        ? "Try adjusting your filters or search terms"
                        : "No doctors are currently available"}
                    </p>
                    {(specialties || search) && (
                      <Button onClick={clearFilters}>Clear Filters</Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Doctors</h2>
                <p className="text-gray-600">Preparing your personalized list...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <DoctorsPageContent />
    </Suspense>
  );
};

export default DoctorsPage;
