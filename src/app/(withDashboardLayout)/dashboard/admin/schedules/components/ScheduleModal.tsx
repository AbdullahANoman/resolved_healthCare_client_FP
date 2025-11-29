// app/dashboard/admin/schedules/components/ScheduleModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCreateScheduleMutation } from '@/redux/api/scheduleApi';
import { toast } from 'sonner';
import { Loader2, Calendar, Clock, AlertCircle, Plus, X, Info } from 'lucide-react';

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
};

const ScheduleModal = ({ open, setOpen, onSuccess }: TProps) => {
  const [createSchedule, { isLoading }] = useCreateScheduleMutation();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });

  // Predefined time slots for quick selection
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Set default values when modal opens
  useEffect(() => {
    if (open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      setFormData({
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: dayAfterTomorrow.toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00'
      });
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickTimeSelect = (type: 'start' | 'end', time: string) => {
    setFormData(prev => ({
      ...prev,
      [type === 'start' ? 'startTime' : 'endTime']: time
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
        toast.error("Missing fields", {
          description: "Please fill in all required fields.",
        });
        return;
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        toast.error("Invalid dates", {
          description: "End date cannot be before start date.",
        });
        return;
      }

      // Validate times for same day
      if (formData.startDate === formData.endDate && formData.endTime <= formData.startTime) {
        toast.error("Invalid times", {
          description: "End time must be after start time for the same day.",
        });
        return;
      }

      // Prepare the exact payload structure
      const scheduleData = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      console.log("Submitting schedule data:", scheduleData);

      const res = await createSchedule(scheduleData).unwrap();

      console.log(res)
      
      if (res?.success == true || res[0]?.id) {
        toast.success("🎉 Schedule created successfully!", {
          description: "The new schedule has been added to the system.",
        });
        setOpen(false);
        setFormData({ startDate: '', endDate: '', startTime: '', endTime: '' });
        onSuccess?.();
      }
    } catch (err: any) {
      console.error("Schedule creation error:", err);
      toast.error("Failed to create schedule", {
        description: err?.data?.message || "Please check your inputs and try again.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ startDate: '', endDate: '', startTime: '', endTime: '' });
  };

  // Calculate duration
  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return '';
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Create New Schedule
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add a new schedule slot for appointment availability
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">24-hour Format</p>
                  <p className="text-xs text-blue-700">Use HH:MM (14:30 = 2:30 PM)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Info className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Duration</p>
                  <p className="text-xs text-green-700">{getDuration() || 'Select dates'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-6">
              {/* Date Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Schedule Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="font-medium">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="endDate" className="font-medium">
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Schedule Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">


                  <Separator />

                  {/* Quick Time Selection */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Start Time</Label>
                        <Select onValueChange={(value) => handleQuickTimeSelect('start', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={`start-${time}`} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">End Time</Label>
                        <Select onValueChange={(value) => handleQuickTimeSelect('end', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem 
                                key={`end-${time}`} 
                                value={time}
                                disabled={formData.startDate === formData.endDate && time <= formData.startTime}
                              >
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isLoading}
                  className="gap-2 min-w-[100px]"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="gap-2 min-w-[140px] bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Schedule
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;