"use client";


import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Calendar,
  Stethoscope,
  DollarSign,
  Activity,
  MessageSquare,
  FileText,
  Clock,
  TrendingUp,
  Star,
  Video,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import LottieLoader from "@/components/Shared/Loader/LottieLoader";
import { useGetMetaQuery } from "@/redux/api/metaApi";

const DoctorDashboardPage = () => {
  const { data: meta, isLoading, error } = useGetMetaQuery({});

  console.log(meta?.response)

  const upcomingAppointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "10:00 AM",
      type: "Follow-up",
      status: "confirmed",
      duration: "30 min",
    },
    {
      id: 2,
      patientName: "Michael Chen",
      time: "11:30 AM",
      type: "Consultation",
      status: "confirmed",
      duration: "45 min",
    },
    {
      id: 3,
      patientName: "Emma Wilson",
      time: "2:00 PM",
      type: "Check-up",
      status: "pending",
      duration: "30 min",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Appointment completed",
      patient: "John Doe",
      time: "30 minutes ago",
      type: "success",
    },
    {
      id: 2,
      action: "Prescription sent",
      patient: "Maria Garcia",
      time: "1 hour ago",
      type: "success",
    },
    {
      id: 3,
      action: "Patient message received",
      patient: "Robert Smith",
      time: "2 hours ago",
      type: "info",
    },
    {
      id: 4,
      action: "Appointment rescheduled",
      patient: "Lisa Wong",
      time: "3 hours ago",
      type: "warning",
    },
  ];

  const appointmentStatusData: Array<{ status: string; count: number }> = meta?.response?.formattedAppointmentStatusDistribution || [];
  const totalAppointments = meta?.response?.appointmentCount || 0;
  const patientCount = meta?.response?.patientCount || 0;
  const reviewCount = meta?.response?.reviewCount || 0;
  const totalRevenue = typeof meta?.response?.totalRevenue === 'number' 
    ? meta.response.totalRevenue 
    : (meta?.response?.totalRevenue?._sum?.amount || 0);

  // Calculate percentage for each appointment status
  const getStatusPercentage = (statusCount: number) => {
    return totalAppointments > 0 ? (statusCount / totalAppointments) * 100 : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "info":
        return "outline";
      default:
        return "default";
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    href,
  }: {
    title: string;
    value: number;
    icon: any;
    description?: string;
    trend?: number;
    href?: string;
  }) => {
    const content = (
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary cursor-pointer group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <TrendingUp
                className={`h-3 w-3 mr-1 ${
                  trend >= 0 ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-xs ${
                  trend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend >= 0 ? "+" : ""}
                {trend}% from last week
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );

    return href ? (
      <Link href={href} className="block">
        {content}
      </Link>
    ) : (
      content
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center bg-white items-center w-full min-h-screen">
        <LottieLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is what is happening with your practice today.
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Clock className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Activity className="h-3 w-3 mr-1" />
            {totalAppointments} appointments today
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={totalAppointments}
          icon={Calendar}
          description={`${upcomingAppointments.filter(a => a.status === 'confirmed').length} confirmed`}
          href="/dashboard/s"
        />
        <StatCard
          title="Active Patients"
          value={patientCount}
          icon={Users}
          description="Patients under your care"
          trend={12}
          href="/dashboard/doctor/patients"
        />
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          icon={DollarSign}
          description="This month's earnings"
          trend={8}
          href="/dashboard/doctor/revenue"
        />
        <StatCard
          title="Patient Reviews"
          value={reviewCount}
          icon={Star}
          description="Average rating: 4.9"
          trend={5}
          href="/dashboard/doctor/reviews"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Appointments */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today is Schedule</CardTitle>
                <CardDescription>
                  Upcoming appointments for {format(new Date(), "MMM d, yyyy")}
                </CardDescription>
              </div>
              <Link href="/dashboard/doctor/appointments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {appointment.patientName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appointment.status === "confirmed"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                          <Video className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8">
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Appointment Status Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>
              Distribution of all your appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentStatusData.map((statusData:any) => {
              const percentage = getStatusPercentage(statusData.count);
              return (
                <div key={statusData.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          statusData.status
                        )}`}
                      />
                      <span className="text-sm font-medium">
                        {statusData.status}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {statusData.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}

            {/* Quick Stats Summary */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {appointmentStatusData.find(
                      (s:any) => s.status === "COMPLETED"
                    )
                      ? getStatusPercentage(
                          appointmentStatusData.find(
                            (s:any) => s.status === "COMPLETED"
                          )!.count 
                        ).toFixed(0)
                      : "0"}
                    %
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Cancellation Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {appointmentStatusData.find(
                      (s:any) => s.status === "CANCELLED"
                    )
                      ? getStatusPercentage(
                          appointmentStatusData.find(
                            (s:any) => s.status === "CANCELLED"
                          )!.count
                        ).toFixed(0)
                      : "0"}
                    %
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/doctor/appointments/schedule">
              <Button className="w-full justify-start cursor-pointer gap-2 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Calendar className="h-4 w-4" />
                Schedule Appointment
              </Button>
            </Link>
            <Link href="/dashboard/doctor/patients">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
              >
                <UserCheck className="h-4 w-4" />
                View All Patients
              </Button>
            </Link>
            <Link href="/dashboard/doctor/prescriptions/create">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
              >
                <FileText className="h-4 w-4" />
                Write Prescription
              </Button>
            </Link>
            <Link href="/dashboard/doctor/messages">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
              >
                <MessageSquare className="h-4 w-4" />
                Check Messages
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest actions from your practice
                </CardDescription>
              </div>
              <Link href="/dashboard/doctor/activities">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50"
                >
                  <div className="mt-0.5">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Patient: {activity.patient}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(activity.type)}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Performance</CardTitle>
          <CardDescription>Key metrics for this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Patient Satisfaction
                </span>
                <span className="text-sm text-muted-foreground">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on {reviewCount} reviews
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">On-time Rate</span>
                <span className="text-sm text-muted-foreground">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Appointments starting on schedule
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Follow-up Completion
                </span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Scheduled follow-ups completed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboardPage;