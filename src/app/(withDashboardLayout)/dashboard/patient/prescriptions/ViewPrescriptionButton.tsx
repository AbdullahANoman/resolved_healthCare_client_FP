// components/prescriptions/ViewPrescriptionButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Calendar, User, FileText, Pill, Download, Printer, Loader2 } from "lucide-react";
import { usePrescriptionPdf } from "./usePrescriptionPDF";

interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate: string;
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience: number;
    gender: string;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    averageRating: number;
  };
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string;
    address: string;
  };
  appointment: {
    id: string;
    patientId: string;
    doctorId: string;
    scheduleId: string;
    videoCallingId: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface ViewPrescriptionButtonProps {
  data: Prescription;
}

const ViewPrescriptionButton = ({ data }: ViewPrescriptionButtonProps) => {
  const { 
    contentRef, 
    downloadPrescriptionPdf, 
    isGenerating 
  } = usePrescriptionPdf({
    patientName: data.patient.name,
    doctorName: data.doctor.name,
    onSuccess: () => {
      console.log('PDF downloaded successfully');
    },
    onError: (error) => {
      console.error('PDF download failed:', error);
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Function to safely render HTML instructions
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-blue-600" />
            Medical Prescription
          </DialogTitle>
          <DialogDescription>
            Prescription details and medical instructions
          </DialogDescription>
        </DialogHeader>

        {/* PDF Content - This will be captured for PDF generation */}
        <div ref={contentRef} className="prescription-content bg-white p-6 rounded-lg border">
          {/* Header Section */}
          <div className="text-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">MEDICAL PRESCRIPTION</h1>
            <p className="text-gray-600">HealthBridge Healthcare Platform</p>
          </div>

          <div className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doctor</p>
                    <p className="font-semibold text-gray-900">{data.doctor.name}</p>
                    <p className="text-sm text-gray-600">{data.doctor.designation}</p>
                    <p className="text-xs text-gray-500">{data.doctor.qualification}</p>
                    <p className="text-xs text-gray-500">Reg: {data.doctor.registrationNumber}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hospital/Clinic</p>
                  <p className="text-sm text-gray-700">{data.doctor.currentWorkingPlace}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patient</p>
                    <p className="font-semibold text-gray-900">{data.patient.name}</p>
                    <p className="text-sm text-gray-600">{data.patient.contactNumber}</p>
                    <p className="text-xs text-gray-500">{data.patient.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Prescription Date</p>
                  <p className="text-sm text-gray-700">{formatDateTime(data.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Medical Instructions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Pill className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Medical Instructions</h3>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px]">
                <div 
                  className="prose prose-sm max-w-none prescription-instructions"
                  dangerouslySetInnerHTML={createMarkup(data.instructions)}
                />
              </div>
            </div>

            {/* Follow-up Information */}
            {data.followUpDate && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Follow-up Appointment</h3>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Scheduled for: <span className="font-semibold text-orange-700">{formatDate(data.followUpDate)}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Please schedule your next appointment before this date
                  </p>
                </div>
              </div>
            )}

            {/* Doctor Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 border-b pb-1">Doctor Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Phone: </span>
                  <span className="text-gray-900">{data.doctor.contactNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email: </span>
                  <span className="text-gray-900">{data.doctor.email}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600">Address: </span>
                  <span className="text-gray-900">{data.doctor.address}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t pt-4 mt-6">
              <p>This is an electronically generated prescription from HealthBridge Platform</p>
              <p>Prescription ID: {data.id}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            onClick={downloadPrescriptionPdf}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPrescriptionButton;