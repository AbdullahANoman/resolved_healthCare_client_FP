"use client";

import { useGetAllPaymentsQuery } from "@/redux/api/paymentApi";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { DollarSign, Calendar, Clock, CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react";
import { DataTable } from "@/components/Shared/DataTable/DataTable";
import { TableSkeleton } from "@/components/Shared/DataTable/TableSkeleton";

const PaymentHistoryTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const buildQueryParams = () => {
    const params: any = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
    return params;
  };
  
  const { data, isLoading } = useGetAllPaymentsQuery(buildQueryParams());
  
  console.log(data)
  
  const paymentData = data || [];
  const meta = data?.meta;
  
  // Format date utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Format time utility
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  // Format date and time
  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };
  
  const handlePaginationChange = (newPagination: any) => {
    setPagination(newPagination);
  };
  
  // Calculate time since payment
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "UNPAID":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => {
        return (
          <button className="px-3 py-1 text-blue-600 hover:text-blue-800 bg-white hover:bg-gray-100 rounded-md border border-gray-300 transition-colors duration-200 text-xs font-medium">
            {row.original.id.slice(0, 8)}...
          </button>
        );
      },
      meta: {
        sticky: true,
        left: true,
        className: "sticky left-0 bg-white z-10 shadow-right",
      },
    },
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-sm">
              {row.original.transactionId}
            </span>
            <span className="text-xs text-gray-600">
              Ref: {row.original.appointmentId.slice(0, 8)}...
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold">
              ৳{row.original.amount}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const Icon = getStatusIcon(status as string);
        return (
          <div className="flex items-center space-x-2">
            {Icon}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === "PAID"
                  ? "bg-green-100 text-green-800"
                  : status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "UNPAID"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {status as React.ReactNode}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-blue-500" />
            <span className="text-sm">
              {formatDate(row.original.createdAt)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdTime",
      header: "Time",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-green-500" />
            <span className="text-sm">
              {formatTime(row.original.createdAt)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-gray-700">
              {formatDate(row.original.updatedAt)}
            </span>
            <span className="text-xs text-gray-500">
              {getTimeSince(row.original.updatedAt)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "paymentGateway",
      header: "Payment Gateway",
      cell: ({ row }) => {
        const hasGatewayData = row.original.paymentGetWayData !== null;
        return (
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                hasGatewayData
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {hasGatewayData ? "SSL Commerz" : "Not Processed"}
            </span>
          </div>
        );
      },
      meta: {
        sticky: true,
        left: false,
        className: "sticky right-0 bg-white z-10 shadow-left",
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <div>
      <DataTable
        data={paymentData}
        columns={columns}
        tableName="Payment History"
        tableSubTitle="Track and manage all your payment transactions"
        filters={[
          {
            columnId: "status",
            placeholder: "Filter by Status",
            options: [
              { value: "PAID", label: "Paid" },
              { value: "PENDING", label: "Pending" },
              { value: "UNPAID", label: "Unpaid" },
            ],
          },
          {
            columnId: "paymentGateway",
            placeholder: "Filter by Gateway",
            options: [
              { value: "hasGatewayData", label: "SSL Commerz" },
              { value: "noGatewayData", label: "Not Processed" },
            ],
          },
        ]}
        rowTooltipContent={(rowData) => {
          const isPaid = rowData.status === "PAID";
          const hasGatewayData = rowData.paymentGetWayData !== null;
          
          return (
            <div className="space-y-3 min-w-[250px]">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm font-medium">Payment Details</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  isPaid 
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {rowData.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs ">Transaction ID:</span>
                  <span className="text-xs font-medium">
                    {rowData.transactionId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Appointment ID:</span>
                  <span className="text-xs font-medium">
                    {rowData.appointmentId.slice(0, 12)}...
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Amount:</span>
                  <span className="text-xs font-semibold">
                    ৳{rowData.amount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Created:</span>
                  <span className="text-xs font-medium">
                    {formatDateTime(rowData.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Updated:</span>
                  <span className="text-xs font-medium">
                    {formatDateTime(rowData.updatedAt)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs ">Gateway:</span>
                  <span className={`text-xs font-medium ${
                    hasGatewayData ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {hasGatewayData ? "SSL Commerz" : "No Gateway Data"}
                  </span>
                </div>
              </div>
            </div>
          );
        }}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={meta ? Math.ceil(meta.total / meta.limit) : 1}
        totalItems={meta?.total || 0}
      />
    </div>
  );
};

export default PaymentHistoryTable;