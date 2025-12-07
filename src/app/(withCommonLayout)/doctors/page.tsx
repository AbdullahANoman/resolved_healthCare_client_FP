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
import { Search, Filter, Users, Star, Calendar, X, Menu, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScrollCategory from "@/components/Doctors/ScrollCategory";
import DoctorCard from "@/components/Doctors/DoctorCard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const DoctorsPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

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
    setShowFilters(false); // Close mobile filters
  };

  // Clear all filters
  const clearFilters = () => {
    router.push("/doctors");
    setSearchTerm("");
    setShowFilters(false);
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
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Failed to Load Doctors
              </h2>
              <p className="text-gray-600 mb-6">
                There was an error loading the doctors list. Please try again.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 px-6"
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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Mobile Search Bar */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-bold text-gray-900 flex-1">
              Find Doctors
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="h-4 w-4" />
              {(specialties || search) && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
              )}
            </Button>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-10"
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>

        {/* Active Filters Display */}
        {(specialties || search) && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {specialties && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {specialties}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleSpecialtyChange("")}
                  />
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {search}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete("search");
                      router.push(`/doctors?${params.toString()}`);
                    }}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-full sm:w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Filter doctors by specialty and search criteria
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Specialties Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Specialties</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <Button
                  variant={!specialties ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSpecialtyChange("")}
                >
                  All Specialties
                </Button>
                {specialtiesLoading ? (
                  <div className="space-y-2">
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

            <div className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Find Your Specialist Doctor
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with experienced healthcare professionals
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:w-1/4">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
                  {(specialties || search) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Specialties Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Specialties</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    <Button
                      variant={!specialties ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSpecialtyChange("")}
                    >
                      All Specialties
                    </Button>
                    {specialtiesLoading ? (
                      <div className="space-y-2">
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
                          className="w-full justify-start truncate"
                          onClick={() => handleSpecialtyChange(specialty.title)}
                        >
                          {specialty.title}
                        </Button>
                      ))
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Doctors</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <span className="font-semibold">{stats.averageRating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Available</span>
                    <span className="font-semibold">{stats.available}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Category Scroll */}
            <div className="mb-6">
              <ScrollCategory
                specialties={specialties}
                onSpecialtyChange={handleSpecialtyChange}
                isLoading={specialtiesLoading}
                specialtiesList={specialtiesList}
              />
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {specialties ? `${specialties} Specialists` : "All Doctors"}
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({doctors.length} found)
                  </span>
                </h2>
                {search && (
                  <p className="text-sm text-gray-500 mt-1">
                    Search results for: `${search}`
                  </p>
                )}
              </div>
              
              {/* View Toggle - Desktop only */}
              <div className="hidden lg:flex items-center gap-2">
                <Tabs
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as "grid" | "list")}
                  className="w-auto"
                >
                  <TabsList>
                    <TabsTrigger value="list" className="px-3">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="grid" className="px-3">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Doctors List */}
            {doctorsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : doctors.length > 0 ? (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                {doctors.map((doctor: any) => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Doctors Found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {specialties || search
                      ? "Try adjusting your filters or search terms"
                      : "No doctors are currently available"}
                  </p>
                  {(specialties || search) && (
                    <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700">
                      Clear Filters & Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Mobile Stats Cards */}
            <div className="lg:hidden grid grid-cols-3 gap-2 mt-6">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-blue-600 mb-1">Total</p>
                  <p className="text-lg font-bold text-blue-700">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-green-600 mb-1">Rating</p>
                  <p className="text-lg font-bold text-green-700">{stats.averageRating.toFixed(1)}</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-100">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-purple-600 mb-1">Available</p>
                  <p className="text-lg font-bold text-purple-700">{stats.available}</p>
                </CardContent>
              </Card>
            </div>
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
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Doctors</h2>
              <p className="text-gray-600">Please wait...</p>
            </div>
          </div>
        </div>
      }
    >
      <DoctorsPageContent />
    </Suspense>
  );
};

export default DoctorsPage;