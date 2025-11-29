'use client';
import { useCreateAppointmentMutation } from '@/redux/api/appointmentApi';
import { useGetAllDoctorSchedulesQuery } from '@/redux/api/doctorScheduleApi';
import { useInitialPaymentMutation } from '@/redux/api/paymentApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface ScheduleSlot {
  id: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
  isBooked?: boolean;
}

const DoctorScheduleSlots = ({ id }: { id: string }) => {
  const [scheduleId, setScheduleId] = useState('');
  const router = useRouter();

  // Get date range for the last 7 days and next 7 days to show more options
  const startDate = dayjs().subtract(7, 'day').startOf('day').toISOString();
  const endDate = dayjs().add(7, 'day').endOf('day').toISOString();

  const { data, isLoading } = useGetAllDoctorSchedulesQuery({
    doctorId: id,
  });
  const doctorSchedules = data?.doctorSchedules || [];


  const availableSlots = doctorSchedules.filter(
    (slot: ScheduleSlot) => !slot.isBooked
  );

  const [createAppointment] = useCreateAppointmentMutation();
  const [initialPayment] = useInitialPaymentMutation();

  const handleBookAppointment = async () => {
    try {
      if (id && scheduleId) {
        const res = await createAppointment({
          doctorId: id,
          scheduleId,
        }).unwrap();

        if (res.id) {
          const response = await initialPayment(res.id).unwrap();
          if (response.paymentUrl) {
            router.push(response.paymentUrl);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Group slots by date
  const groupedSlots = availableSlots.reduce((acc: any, slot: ScheduleSlot) => {
    const date = dayjs(slot.startDateTime).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedSlots).sort();

  const getTimeIn12HourFormat = (dateTime: string) => {
    return dayjs(dateTime).format('h:mm A');
  };

  const formatDateDisplay = (dateString: string) => {
    const date = dayjs(dateString);
    const today = dayjs().startOf('day');
    const yesterday = today.subtract(1, 'day');
    
    if (date.isSame(today, 'day')) {
      return 'Today';
    } else if (date.isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return date.format('ddd, MMM D, YYYY');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading available slots...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-6 w-6 text-primary" />
            Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableSlots.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm font-medium">
                      {formatDateDisplay(date)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {groupedSlots[date].length} slot(s) available
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {groupedSlots[date]
                      .sort((a: ScheduleSlot, b: ScheduleSlot) => 
                        dayjs(a.startDateTime).diff(dayjs(b.startDateTime))
                      )
                      .map((slot: ScheduleSlot) => (
                        <Button
                          key={slot.id}
                          variant={slot.id === scheduleId ? "default" : "outline"}
                          className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:shadow-md"
                          onClick={() => setScheduleId(slot.id)}
                        >
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {getTimeIn12HourFormat(slot.startDateTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to {getTimeIn12HourFormat(slot.endDateTime)}
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">No slots available</h3>
                <p className="text-muted-foreground mt-1">
                  There are no available time slots for this doctor in the selected date range.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {scheduleId && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Selected Time Slot</h3>
                {availableSlots
                  .filter((slot: ScheduleSlot) => slot.id === scheduleId)
                  .map((slot: ScheduleSlot) => (
                    <div key={slot.id} className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {dayjs(slot.startDateTime).format('dddd, MMMM D, YYYY')}
                      </p>
                      <p className="text-lg font-medium">
                        {getTimeIn12HourFormat(slot.startDateTime)} - {getTimeIn12HourFormat(slot.endDateTime)}
                      </p>
                    </div>
                  ))}
              </div>
              
              <Button 
                onClick={handleBookAppointment}
                size="lg"
                className="w-full sm:w-auto"
              >
                Confirm & Book Appointment
              </Button>
              
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You will be redirected to the payment page to complete your booking
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorScheduleSlots;