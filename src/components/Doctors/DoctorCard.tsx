// app/doctors/components/DoctorCard.tsx
"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Award,
  Clock,
  Heart,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Doctor {
  id: string;
  name: string;
  profilePhoto: string;
  designation: string;
  qualification: string;
  currentWorkingPlace: string;
  experience: number;
  appointmentFee: number;
  averageRating: number;
  isDeleted?: boolean;
  doctorSpecialties: Array<{
    specialties: {
      title: string;
      icon?: string;
    };
  }>;
}

interface DoctorCardProps {
  doctor: Doctor;
  viewMode?: "list" | "grid";
}

const DoctorCard = ({ doctor, viewMode = "list" }: DoctorCardProps) => {
  const specialties = doctor.doctorSpecialties?.map(ds => ds.specialties.title) || [];

  if (viewMode === "grid") {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-blue-300 h-full">
        <CardContent className="p-4">
          {/* Doctor Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-14 w-14 border-2 border-blue-100">
                <AvatarImage 
                  src={doctor.profilePhoto} 
                  alt={doctor.name}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {doctor.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {doctor.designation}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <Heart className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-semibold text-gray-900">
              {doctor.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-600">{doctor.experience} yrs exp</span>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-3">
            {specialties.slice(0, 2).map((specialty, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700"
              >
                {specialty}
              </Badge>
            ))}
            {specialties.length > 2 && (
              <span className="text-xs text-gray-500">+{specialties.length - 2}</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-1 text-xs text-gray-600 mb-4">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{doctor.currentWorkingPlace}</span>
          </div>

          {/* Fee */}
          <div className="flex items-center justify-between mt-auto">
            <div className="text-left">
              <p className="text-xs text-gray-500">Fee</p>
              <p className="text-sm font-bold text-gray-900">
                ৳{doctor.appointmentFee}
              </p>
            </div>
            <Button asChild size="sm" className="text-xs">
              <Link href={`/doctors/${doctor.id}`}>
                Book Now
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List View (Default)
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border hover:border-blue-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Doctor Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-blue-100">
                <AvatarImage 
                  src={doctor.profilePhoto} 
                  alt={doctor.name}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {doctor.averageRating >= 4.5 && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {doctor.designation}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 sm:mt-0">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">
                      {doctor.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">({doctor.experience} yrs)</span>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{doctor.currentWorkingPlace}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {specialties.slice(0, 4).map((specialty, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-50"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {specialties.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{specialties.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col gap-3 min-w-[140px]">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-gray-900">
                      ৳{doctor.appointmentFee}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Consultation Fee</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    asChild 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                  >
                    <Link href={`/doctors/${doctor.id}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      View Profile
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href={`/doctors/${doctor.id}?tab=booking`}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;