// app/dashboard/admin/schedules/components/DeleteScheduleModal.tsx
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
import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  scheduleDate: string;
  isLoading: boolean;
}

const DeleteScheduleModal: React.FC<DeleteScheduleModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  scheduleDate,
  isLoading,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete the schedule for{" "}
              <span className="font-semibold text-foreground">
                {scheduleDate}
              </span>
              ? This action cannot be undone and may affect existing appointments.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 font-medium">Warning</p>
              <p className="text-xs text-red-700 mt-1">
                This action is permanent and cannot be reversed. Any appointments associated with this schedule will be affected.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteScheduleModal;