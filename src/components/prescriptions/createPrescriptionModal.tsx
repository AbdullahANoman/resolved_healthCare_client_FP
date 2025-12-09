"use client";

import React, { useState } from "react";
import { X, FileText, AlertCircle } from "lucide-react";
import { useCreatePrescriptionMutation } from "@/redux/api/prescriptionApi";
import { toast } from "sonner";

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
}

const CreatePrescriptionModal: React.FC<CreatePrescriptionModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  patientId,
  patientName,
  doctorId,
}) => {
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();
  
  const [formData, setFormData] = useState({
    instructions: "",
    followUpDate: "",
    appointmentId,  
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.instructions.trim()) {
      toast.error("Instructions are required");
      return;
    }

    try {
      // Prepare data for API call
      const prescriptionData = {
        instructions: formData.instructions,
        appointmentId: formData.appointmentId,
        // Convert date to ISO string if provided, otherwise send undefined
        followUpDate: formData.followUpDate 
          ? new Date(formData.followUpDate + 'T10:00:00').toISOString() // Add default time (10:00 AM)
          : undefined,
      };

      const result = await createPrescription(prescriptionData).unwrap();

      if(result?.success){
          toast.success(result?.message || "Prescription created successfully");
      }

      if(!result?.success){
        toast.error(result?.message || "Failed to create prescription. Please try again.");
      }
      
      
      // Reset form and close modal
      setFormData({
        instructions: "",
        followUpDate: "",
        appointmentId
      });
      onClose();
      
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create prescription. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create Prescription
              </h2>
              <p className="text-sm text-gray-600">
                For patient: <span className="font-medium">{patientName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter detailed instructions for the patient..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Include medication details, dosage, frequency, etc.
            </p>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date (Optional)
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Follow-up date will be set to 10:00 AM by default
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Information</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This prescription will be linked to appointment #{appointmentId}</li>
                  <li>The patient will receive a copy of this prescription</li>
                  <li>You can view and edit prescriptions from the prescriptions tab</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Create Prescription</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescriptionModal;