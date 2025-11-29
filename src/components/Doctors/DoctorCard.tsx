// app/doctors/components/DoctorCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Award,
  Clock 
} from "lucide-react";
import Link from "next/link";

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
  doctorSpecialties: Array<{
    specialties: {
      title: string;
    };
  }>;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const specialties = doctor.doctorSpecialties.map(ds => ds.specialties.title);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Avatar and Basic Info */}
          <div className="flex-shrink-0">
            <Avatar className="h-20 w-20 border-2 border-blue-100">
              <AvatarImage 
                src={doctor.profilePhoto} 
                alt={doctor.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Doctor Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-600 font-medium mb-2">
                      {doctor.designation}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-yellow-700">
                      {doctor.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Qualifications and Specialties */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.experience}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{doctor.currentWorkingPlace}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {specialties.slice(0, 3).map((specialty, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {specialties.length > 3 && (
                    <Badge variant="outline" className="text-gray-500">
                      +{specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col gap-3 min-w-[140px]">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-gray-900">
                      ৳{doctor.appointmentFee}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Consultation Fee</p>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Link href={`/doctors/${doctor.id}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      View Profile
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