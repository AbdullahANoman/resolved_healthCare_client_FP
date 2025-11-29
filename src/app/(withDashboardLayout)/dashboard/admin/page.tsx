"use client";

import { useGetMetaQuery } from "@/redux/api/metaApi";
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
  UserCheck,
  Stethoscope,
  DollarSign,
  Activity,
  Settings,
  BarChart3,
  FileText,
  Plus,
  Calendar,
} from "lucide-react";
import { TotalAppointmentCount } from "@/components/Dashboard/Patient/TotalAppointment";
import AdminDashboardCardTittle from "@/components/Dashboard/DashboardEssential/AdminDashboardCardTittle";
import { TotalDoctor } from "@/components/Dashboard/DashboardEssential/TotalDoctor";
import { TotalPatient } from "@/components/Dashboard/DashboardEssential/TotalPatient";
import LottieLoader from "@/components/Shared/Loader/LottieLoader";

const AdminPage = () => {
  const { data: meta, isLoading, error } = useGetMetaQuery({});

  const recentActivities = [
    {
      id: 1,
      action: "New doctor registered",
      user: "Dr. Sarah Wilson",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      action: "Payment processed",
      user: "John Doe",
      time: "3 hours ago",
      status: "success",
    },
    {
      id: 3,
      action: "Appointment cancelled",
      user: "Emma Johnson",
      time: "5 hours ago",
      status: "warning",
    },
    {
      id: 4,
      action: "System maintenance",
      user: "System",
      time: "1 day ago",
      status: "info",
    },
  ];

  const totalAppointment = Number(meta?.response?.appointmentCount) || 0;
  const totalPatient = Number(meta?.response?.patientCoount) || 0;
  const totalDoctor = Number(meta?.response?.doctorCount) || 0;
  const totalRevenue = Number(meta?.response?.totalRevenue) || 0;

  const getStatusVariant = (status: string) => {
    switch (status) {
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
    href,
    description,
  }: {
    title: string;
    value: number;
    icon: any;
    href: string;
    description?: string;
  }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
      <Link href={href} className="block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {description || `Total ${title.toLowerCase()}`}
          </p>
        </CardContent>
      </Link>
    </Card>
  );

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
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your HealthBridge platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <Link
            href={"/super-admin/my-booking/flight-booking"}
            className="block"
          >
            <AdminDashboardCardTittle tittle="Total Appointment" />
            <TotalAppointmentCount
              totalAppointment={totalAppointment}
              capacity={10}
              label={`Total Appointment`}
            />
            {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              View all bookings →
            </div> */}
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <Link
            href={"/dashboard/admin/patients"}
            className="block"
          >
            <AdminDashboardCardTittle tittle="Total Patient" />
            <TotalPatient
              totalFlightBookings={totalPatient}
              capacity={10}
              label={`Total Patient`}
            />
            {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              View all bookings →
            </div> */}
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <Link href={"/dashboard/admin/doctors"} className="block">
            <AdminDashboardCardTittle tittle="Total Doctor" />
            <TotalDoctor
              totalFlightBookings={totalDoctor}
              capacity={10}
              label={`Total Doctor`}
            />
            {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              View all bookings →
            </div> */}
          </Link>
        </div>
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          icon={DollarSign}
          href="/dashboard/admin/revenue"
          description="Total platform revenue"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.action}
                    </TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>{activity.time}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(activity.status)}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>Quick access to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={"/dashboard/admin/doctors"}>
            <Button className="w-full justify-start cursor-pointer gap-2 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <Plus className="h-4 w-4" />
              Add New Doctor
            </Button></Link>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-12"
            >
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-12"
            >
              <FileText className="h-4 w-4" />
              Generate Reports
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-12"
            >
              <Settings className="h-4 w-4" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Current system performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Performance</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Good</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Health</span>
                <span className="text-sm text-muted-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Excellent</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">Good</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
