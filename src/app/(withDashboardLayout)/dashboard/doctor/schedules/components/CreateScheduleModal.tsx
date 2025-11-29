import { useCreateDoctorScheduleMutation, useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Create Schedule Modal Component
const CreateScheduleModal = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  
  const { data: allSchedules, isLoading } = useGetAllDoctorSchedulesQuery({});
  const [createDoctorSchedule, { isLoading: isCreating }] = useCreateDoctorScheduleMutation();

  const availableSchedules = allSchedules?.doctorSchedules || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const handleScheduleSelect = (scheduleId: string) => {
    setSelectedSchedules(prev => 
      prev.includes(scheduleId) 
        ? prev.filter(id => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSchedules.length === availableSchedules.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(availableSchedules.map((schedule: any) => schedule.id));
    }
  };

  const handleCreateSchedule = async () => {
    if (selectedSchedules.length === 0) {
      toast.error("Please select at least one schedule");
      return;
    }

    try {
      const response = await createDoctorSchedule({
        scheduleIds: selectedSchedules
      }).unwrap();

      if (response.success) {
        toast.success("Schedule created successfully");
        setOpen(false);
        setSelectedSchedules([]);
        refetch(); // Refresh the schedule list
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create schedule");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedules([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create New Schedule
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header with selection info */}
          <div className="flex justify-between items-center mb-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Select available time slots for your schedule
              </p>
              <p className="text-xs text-blue-700">
                {selectedSchedules.length} schedule(s) selected
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
              disabled={availableSchedules.length === 0}
            >
              {selectedSchedules.length === availableSchedules.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          {/* Schedules List */}
          <div className="flex-1 overflow-y-auto border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span>Loading available schedules...</span>
              </div>
            ) : availableSchedules.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No available schedules found</p>
                <p className="text-sm">Please contact administrator to create schedules</p>
              </div>
            ) : (
              <div className="divide-y">
                {availableSchedules.map((schedule: any) => (
                  <div
                    key={schedule.id}
                    className={`p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
                      selectedSchedules.includes(schedule.id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <Checkbox
                      checked={selectedSchedules.includes(schedule.id)}
                      onCheckedChange={() => handleScheduleSelect(schedule.id)}
                      id={`schedule-${schedule.id}`}
                    />
                    <Label
                      htmlFor={`schedule-${schedule.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">
                              {formatDate(schedule.startDateTime)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-green-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">
                              {getTimeRange(schedule.startDateTime, schedule.endDateTime)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Duration: {((new Date(schedule.endDateTime).getTime() - new Date(schedule.startDateTime).getTime()) / (1000 * 60))} min
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedSchedules.length} schedule(s) selected
              </span>
              <Button
                onClick={handleCreateSchedule}
                disabled={selectedSchedules.length === 0 || isCreating}
                className="gap-2"
              >
                {isCreating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Schedule ({selectedSchedules.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheduleModal;