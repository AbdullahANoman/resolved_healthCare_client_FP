/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from "react";
import { useCreateDoctorScheduleMutation } from "@/redux/api/doctorScheduleApi";
import { useGetAllSchedulesQuery } from "@/redux/api/scheduleApi";
import { toast } from "sonner";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  Filter,
  Search,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

const CreateScheduleModal = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Query parameters for fetching schedules
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit,
    };

    if (searchQuery) {
      params['searchTerm'] = searchQuery;
    }

    if (dateFilter) {
      params['startDate'] = dayjs(dateFilter).startOf('day').toISOString();
      params['endDate'] = dayjs(dateFilter).endOf('day').toISOString();
    }

    return params;
  }, [page, limit, searchQuery, dateFilter]);

  const { data: allSchedules, isLoading, refetch: refetchSchedules } = useGetAllSchedulesQuery(queryParams);
  
  const schedules: Schedule[] = allSchedules?.schedules?.data || [];
  const meta: PaginationMeta = allSchedules?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };


  // Update pagination when data changes
  useEffect(() => {
    if (meta) {
      setTotalPages(meta.totalPages || Math.ceil(meta.total / meta.limit));
    }
  }, [meta]);

  const [createDoctorSchedule, { isLoading: isCreating }] =
    useCreateDoctorScheduleMutation();

  // Filter and group schedules (client-side for current page)
  const filteredAndGroupedSchedules = useMemo(() => {
    if (!schedules || !Array.isArray(schedules)) {
      return [];
    }

    let filtered = schedules;

    // Apply client-side search filter (if needed)
    if (searchQuery) {
      filtered = filtered.filter((schedule) => {
        const dateStr = formatDate(schedule.startDateTime);
        const timeStr = formatTimeRange(schedule.startDateTime, schedule.endDateTime);
        return dateStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
               timeStr.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply date filter (client-side fallback)
    if (dateFilter) {
      filtered = filtered.filter((schedule) =>
        dayjs(schedule.startDateTime).format("YYYY-MM-DD") === dateFilter
      );
    }

    // Group by date
    const grouped = filtered.reduce((acc, schedule) => {
      const date = dayjs(schedule.startDateTime).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);

    // Sort dates
    const sortedDates = Object.keys(grouped).sort((a, b) =>
      dayjs(a).isAfter(dayjs(b)) ? 1 : -1
    );

    return sortedDates.map(date => ({ date, schedules: grouped[date] }));
  }, [schedules, searchQuery, dateFilter]);

  // Get unique dates for filtering from all schedules
  const availableDates = useMemo(() => {
    if (!schedules || !Array.isArray(schedules)) {
      return [];
    }
    
    const dates = new Set(schedules.map(s => 
      dayjs(s.startDateTime).format("YYYY-MM-DD")
    ));
    return Array.from(dates).sort();
  }, [schedules]);

  // Formatting functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const getDuration = (start: string, end: string) => {
    try {
      const durationMs = new Date(end).getTime() - new Date(start).getTime();
      return Math.round(durationMs / (1000 * 60)); // in minutes, rounded
    } catch (error) {
      return 0;
    }
  };

  const getDayOfWeek = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      return new Date(dateString).toLocaleDateString("en-US", { weekday: "short" });
    } catch (error) {
      return "";
    }
  };

  // Selection handlers
  const handleScheduleSelect = (scheduleId: string) => {
    setSelectedSchedules((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  const handleSelectAllInDate = (dateSchedules: Schedule[]) => {
    if (!dateSchedules || !Array.isArray(dateSchedules)) return;
    
    const allSelected = dateSchedules.every((s) =>
      selectedSchedules.includes(s.id)
    );

    if (allSelected) {
      // Deselect all in this date
      setSelectedSchedules((prev) =>
        prev.filter((id) => !dateSchedules.some((s) => s.id === id))
      );
    } else {
      // Select all in this date
      const newSelected = dateSchedules
        .filter((s) => !selectedSchedules.includes(s.id))
        .map((s) => s.id);
      setSelectedSchedules((prev) => [...prev, ...newSelected]);
    }
  };

  // Select all on current page
  const handleSelectAllOnPage = () => {
    if (!schedules || !Array.isArray(schedules)) return;
    
    const pageScheduleIds = schedules.map(schedule => schedule.id);
    const allSelectedOnPage = pageScheduleIds.every(id => 
      selectedSchedules.includes(id)
    );

    if (allSelectedOnPage) {
      // Deselect all on this page
      setSelectedSchedules(prev => 
        prev.filter(id => !pageScheduleIds.includes(id))
      );
    } else {
      // Select all on this page
      const newSelected = pageScheduleIds.filter(id => 
        !selectedSchedules.includes(id)
      );
      setSelectedSchedules(prev => [...prev, ...newSelected]);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit));
    setPage(1); // Reset to first page when changing limit
  };

  // Create schedule handler
  const handleCreateSchedule = async () => {
    if (selectedSchedules.length === 0) {
      toast.error("Please select at least one schedule");
      return;
    }

    console.log(selectedSchedules,'selected schedules');

    try {
      const response = await createDoctorSchedule({
        scheduleIds: selectedSchedules,
      }).unwrap();

      console.log(response)

      if ((response as any)?.count) {
        toast.success("Schedule created successfully!");
        handleClose();
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create schedule");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedules([]);
    setSearchQuery("");
    setDateFilter(null);
    setActiveTab("all");
    setPage(1);
    setLimit(20);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter(null);
    setPage(1);
  };

  // Calculate if all on current page are selected
  const isAllOnPageSelected = useMemo(() => {
    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) return false;
    return schedules.every(schedule => selectedSchedules.includes(schedule.id));
  }, [schedules, selectedSchedules]);

  // Calculate how many on current page are selected
  const selectedOnPageCount = useMemo(() => {
    if (!schedules || !Array.isArray(schedules)) return 0;
    return schedules.filter(schedule => selectedSchedules.includes(schedule.id)).length;
  }, [schedules, selectedSchedules]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
          <Plus className="h-4 w-4" />
          Create Schedule
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      Create Schedule
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Select time slots to add to your schedule
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-sm font-medium border-blue-200 bg-blue-50"
                  >
                    {selectedSchedules.length} selected total
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchSchedules()}
                    className="gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                  </Button>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel - Filters */}
            <div className="w-64 border-r bg-gray-50 p-4 space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>
                {/* Date Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Filter by Date</Label>
                  <ScrollArea className="h-48 border rounded-md">
                    <div className="p-2 space-y-1">
                      <Button
                        variant={!dateFilter ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => setDateFilter(null)}
                      >
                        All Dates
                      </Button>
                      {availableDates.map((date) => (
                        <Button
                          key={date}
                          variant={dateFilter === date ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => setDateFilter(date)}
                        >
                          {formatDate(date)}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Statistics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total slots:</span>
                      <span className="font-medium">{meta.total || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Selected total:</span>
                      <span className="font-medium text-blue-600">
                        {selectedSchedules.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current page:</span>
                      <span className="font-medium">
                        {page} of {totalPages}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Showing:</span>
                      <span className="font-medium">
                        {schedules.length} slots
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selection Actions */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selection Actions
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllOnPage}
                      disabled={!schedules || schedules.length === 0}
                      className="w-full justify-start text-sm"
                    >
                      {isAllOnPageSelected ? "Deselect Page" : "Select Page"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSchedules([])}
                      disabled={selectedSchedules.length === 0}
                      className="w-full justify-start text-sm text-red-600 hover:text-red-700"
                    >
                      Clear All Selection
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ">
              {/* Content Header with Pagination Controls */}
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-auto"
                    >
                      <TabsList>
                        <TabsTrigger value="all">All Slots</TabsTrigger>
                        <TabsTrigger value="today">Today</TabsTrigger>
                        <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {(searchQuery || dateFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Show:</span>
                      <Select
                        value={limit.toString()}
                        onValueChange={handleLimitChange}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue placeholder="20" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                           <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-sm text-gray-600">
                      Selected: {selectedOnPageCount}/{schedules.length} on this page
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedules List */}
              <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <div className="space-y-2">
                          {[1, 2, 3].map((j) => (
                            <Skeleton key={j} className="h-16 w-full" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredAndGroupedSchedules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <CalendarDays className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No schedules found
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      {searchQuery || dateFilter
                        ? "Try adjusting your filters to see more results"
                        : "No available schedules. Please check back later or contact support."}
                    </p>
                    {(searchQuery || dateFilter) && (
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredAndGroupedSchedules.map(({ date, schedules: dateSchedules }) => {
                      const allSelected = dateSchedules.every((s) =>
                        selectedSchedules.includes(s.id)
                      );
                      const someSelected = dateSchedules.some((s) =>
                        selectedSchedules.includes(s.id)
                      );

                      return (
                        <div key={date} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <Calendar className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {formatDate(date)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {getDayOfWeek(date)} • {dateSchedules.length}{" "}
                                  slot(s) on this page
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {dateSchedules.filter(s => selectedSchedules.includes(s.id)).length}/{dateSchedules.length} selected
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSelectAllInDate(dateSchedules)}
                                className="text-xs"
                              >
                                {allSelected ? "Deselect All" : "Select All"}
                              </Button>
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {dateSchedules.map((schedule) => {
                              const isSelected = selectedSchedules.includes(
                                schedule.id
                              );
                              const duration = getDuration(
                                schedule.startDateTime,
                                schedule.endDateTime
                              );

                              return (
                                <div
                                  key={schedule.id}
                                  className={cn(
                                    "border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md",
                                    isSelected
                                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                      : "hover:border-gray-300"
                                  )}
                                  onClick={() => handleScheduleSelect(schedule.id)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">
                                          {formatTimeRange(
                                            schedule.startDateTime,
                                            schedule.endDateTime
                                          )}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {duration} min
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        {formatDate(schedule.startDateTime)}
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() =>
                                          handleScheduleSelect(schedule.id)
                                        }
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Footer with Pagination and Actions */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1 || isLoading}
                      title="First page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || isLoading}
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8"
                            disabled={isLoading}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages || isLoading}
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page === totalPages || isLoading}
                      title="Last page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>

                    <div className="text-sm text-gray-600 ml-2">
                      Page {page} of {totalPages} • {meta.total || 0} total slots
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-600">
                        Total selected: <span className="font-semibold text-blue-600">{selectedSchedules.length}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        On this page: {selectedOnPageCount}/{schedules.length}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateSchedule}
                        disabled={selectedSchedules.length === 0 || isCreating}
                        className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {isCreating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Create ({selectedSchedules.length})
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheduleModal;