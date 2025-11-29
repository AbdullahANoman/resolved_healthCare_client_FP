"use client";

import PatientDashboardCardTittle from "@/components/Dashboard/Patient/PatientDashboardCardTittle";
// import { DestinationsChart } from "./DestinationChart";
// import { RevenueChart } from "./RevenueChart";
import Link from "next/link";
import React from "react";
import { TotalAppointmentCount } from "@/components/Dashboard/Patient/TotalAppointment";
import { TotalReview } from "@/components/Dashboard/Patient/TotalReview";
import { TripsCard } from "@/components/Dashboard/Patient/TripsCard";
import { useGetMetaQuery } from "@/redux/api/metaApi";
import { RevenueChart } from "@/components/Dashboard/Patient/RevenueChart";
import { DestinationsChart } from "@/components/Dashboard/Patient/DestinationChart";

const PatientDashboard = () => {
  const { data: meta, isLoading, error } = useGetMetaQuery({});
  const totalAppointment = Number(meta?.response?.appointmentCount);
  const totalReviw = Number(meta?.response?.reviewCount);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Appointements Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <Link href={"/dashboard/patient/appointments"} className="block">
            <PatientDashboardCardTittle tittle="Appointments" />
            <TotalAppointmentCount
              totalAppointment={totalAppointment | 0}
              capacity={10}
              label={`Total Appointments`}
            />
            {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              View all bookings →
            </div> */}
          </Link>
        </div>

        {/* Reviews Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <Link href="/super-admin/agent/all-agent" className="block">
            <PatientDashboardCardTittle tittle="Reviews" />
            <TotalReview
              totalReview={totalReviw | 0}
              capacity={30}
              label={`Total Review`}
            />
            {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              Manage agents →
            </div> */}
          </Link>
        </div>

        {/* Issues Card */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <Link href="/super-admin/all-booking/issueRequest" className="block">
            <PatientDashboardCardTittle tittle="Issue Requests" />
            <TotalIssueCount
              totalIssue={issueCount}
              capacity={200}
              label={`Total Issue Request`}
            />
            <div className="mt-2 text-sm text-blue-600 font-medium">
              View all issues →
            </div>
          </Link>
        </div> */}

        <div>
          <TripsCard totalTrips={1200} done={620} booked={465} canceled={115} />
        </div>
      </div>

      {/* Revenue and Destinations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <DestinationsChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
    </div>
  );
};

export default PatientDashboard;
