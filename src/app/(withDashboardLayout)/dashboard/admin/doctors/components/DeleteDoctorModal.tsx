"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, UserX } from "lucide-react";

interface DeleteDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  doctorName: string;
  isLoading?: boolean;
}

const DeleteDoctorModal = ({
  open,
  onOpenChange,
  onConfirm,
  doctorName,
  isLoading = false,
}: DeleteDoctorModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-red-600">
              Delete Doctor
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-gray-700">
            Are you sure you want to delete <span className="font-semibold text-gray-900">Dr. {doctorName}</span>? 
            This action will permanently remove the doctor from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">This action cannot be undone.</p>
              <p className="mt-1">
                All associated data including appointments, specialties, and profile information will be permanently deleted.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel 
            disabled={isLoading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isLoading ? "Deleting..." : "Delete Doctor"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDoctorModal;