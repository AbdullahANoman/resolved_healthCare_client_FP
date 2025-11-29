// components/Shared/DataTable/DataTable.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import * as React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableName: React.ReactNode;
  tableSubTitle?: string;
  filters?: {
    columnId: string;
    options: { value: string; label: string }[];
    placeholder?: string;
  }[];
  children?: React.ReactNode;
  rowTooltipContent?: (rowData: TData, rowIndex: number) => React.ReactNode;
  // Add pagination props
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  pageCount?: number;
  totalItems?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableName,
  tableSubTitle,
  filters = [],
  children,
  rowTooltipContent,
  // New pagination props
  pagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange,
  pageCount = 1,
  totalItems = 0,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        const hiddenColumns: Record<string, boolean> = {};
        columns.forEach((col) => {
          if (
            !["slNo", "title", "country", "actions"].includes(
              (col as any).accessorKey
            ) &&
            !(col as any).meta?.sticky
          ) {
            hiddenColumns[(col as any).accessorKey || col.id || ""] = true;
          }
        });
        setColumnVisibility(hiddenColumns);
      } else {
        setColumnVisibility({});
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  const table = useReactTable({
    data,
    columns,
    // Server-side pagination
    manualPagination: true,
    pageCount,
    onPaginationChange: onPaginationChange as any,
    // Client-side state
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  });

  return (
    <div className="w-full relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-5">
        {/* Header section */}
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Title section */}
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              {tableName}
            </h2>
            {tableSubTitle && (
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {tableSubTitle}
              </p>
            )}
          </div>

          {/* Search and filters */}
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2 md:space-x-4 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative w-full sm:w-48 md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search"
                value={globalFilter ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                className="pl-8 rounded-lg py-2 bg-white border border-gray-300 focus:border-blue-500 w-full text-sm focus:outline-1 focus:outline-primary"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 sm:flex gap-2">
              {filters.map((filter) => {
                const selectedOptions = filter.options.filter((option) =>
                  columnFilters.some(
                    (f) => f.id === filter.columnId && f.value === option.value
                  )
                );

                return (
                  <DropdownMenu key={filter.columnId}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white hover:bg-blue-50 justify-between truncate text-xs sm:text-sm w-full min-w-[120px] sm:min-w-[140px] border-blue-200 text-blue-700 hover:text-blue-800 transition-colors"
                      >
                        {selectedOptions.length > 0 ? (
                          <span className="truncate">
                            {selectedOptions.map((opt) => opt.label).join(", ")}
                          </span>
                        ) : (
                          filter.placeholder || `Filter by ${filter.columnId}`
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white w-[200px] max-h-[300px] overflow-y-auto border border-blue-100 shadow-lg"
                    >
                      {filter.options.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={columnFilters.some(
                            (f) =>
                              f.id === filter.columnId &&
                              f.value === option.value
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setColumnFilters((prev) => [
                                ...prev.filter((f) => f.id !== filter.columnId),
                                { id: filter.columnId, value: option.value },
                              ]);
                            } else {
                              setColumnFilters((prev) =>
                                prev.filter(
                                  (f) =>
                                    !(
                                      f.id === filter.columnId &&
                                      f.value === option.value
                                    )
                                )
                              );
                            }
                          }}
                          className="capitalize hover:bg-blue-50 text-sm text-gray-700 focus:bg-blue-50 focus:text-blue-700"
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 overflow-x-auto">
        <div className="relative">
          <Table className="min-w-full">
            <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as any;
                    const isSticky = meta?.sticky;
                    const isLeftSticky = isSticky && meta?.left;
                    const isRightSticky = isSticky && !meta?.left;

                    return (
                      <TableHead
                        key={header.id}
                        className={`
                          px-4 sm:px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider whitespace-nowrap
                          ${
                            isLeftSticky
                              ? "sticky left-0 bg-blue-100 z-20 shadow-right"
                              : ""
                          }
                          ${
                            isRightSticky
                              ? "sticky right-0 bg-blue-100 z-20 shadow-left"
                              : ""
                          }
                          hover:bg-blue-200 transition-colors duration-200
                        `}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table?.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TooltipProvider key={row.id} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableRow
                          data-state={row.getIsSelected() && "selected"}
                          className={`
                            border-b border-gray-200 last:border-b-0 group
                            ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            hover:bg-blue-50 transition-colors duration-150 relative
                          `}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const meta = cell.column.columnDef.meta as any;
                            const isSticky = meta?.sticky;
                            const isLeftSticky = isSticky && meta?.left;
                            const isRightSticky = isSticky && !meta?.left;

                            return (
                              <TableCell
                                key={cell.id}
                                className={`
                                  px-4 sm:px-6 py-4 whitespace-nowrap text-sm
                                  ${
                                    rowIndex % 2 === 0
                                      ? "text-gray-800"
                                      : "text-gray-700"
                                  }
                                  ${
                                    isLeftSticky
                                      ? "sticky left-0 bg-white z-10 shadow-right group-hover:bg-blue-50"
                                      : ""
                                  }
                                  ${
                                    isRightSticky
                                      ? "sticky right-0 bg-white z-10 shadow-left group-hover:bg-blue-50"
                                      : ""
                                  }
                                  hover:text-blue-700 hover:font-medium transition-colors duration-150
                                `}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TooltipTrigger>
                      {rowTooltipContent && (
                        <TooltipContent
                          side="left"
                          align="start"
                          sideOffset={5}
                          className="bg-[#4A39D9] text-white shadow-lg p-3 max-w-md"
                        >
                          <div className="space-y-2">
                            {rowTooltipContent(row.original, rowIndex)}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 hover:bg-gray-100"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200 space-y-3 sm:space-y-0">
        <div className="text-xs sm:text-sm text-blue-700">
          <span className="text-blue-600">
            Showing {data.length} of {totalItems} total items
            {pagination && (
              <span className="ml-2">
                (Page {pagination.pageIndex + 1} of {pageCount})
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="hidden sm:inline-flex items-center p-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 hover:text-blue-800"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex items-center px-3 py-1 border border-blue-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 hover:text-blue-800"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          </div>

          <div className="text-xs sm:text-sm text-blue-700 px-2">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {pageCount}
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="inline-flex items-center px-3 py-1 border border-blue-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 hover:text-blue-800"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="hidden sm:inline-flex items-center p-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 hover:text-blue-800"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}