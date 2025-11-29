// components/Shared/TableSkeleton/TableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableSkeletonProps {
  rowCount?: number
  columnCount?: number
  hasStickyColumns?: boolean
}

export function TableSkeleton({ 
  rowCount = 10, 
  columnCount = 8,
  hasStickyColumns = false 
}: TableSkeletonProps) {
  return (
    <div className="w-full relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-5">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2 md:space-x-4 w-full sm:w-auto">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-2 sm:flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border-t border-gray-200 overflow-x-auto">
        <div className="relative">
          <Table className="min-w-full">
            <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, index) => (
                  <TableHead
                    key={index}
                    className={`
                      px-4 sm:px-6 py-3 text-left whitespace-nowrap
                      ${hasStickyColumns && index === 0 ? "sticky left-0 bg-blue-100 z-20 shadow-right" : ""}
                      ${hasStickyColumns && index === columnCount - 1 ? "sticky right-0 bg-blue-100 z-20 shadow-left" : ""}
                    `}
                  >
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`
                    border-b border-gray-200 last:border-b-0
                    ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  `}
                >
                  {Array.from({ length: columnCount }).map((_, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={`
                        px-4 sm:px-6 py-4 whitespace-nowrap
                        ${hasStickyColumns && cellIndex === 0 ? "sticky left-0 bg-white z-10 shadow-right" : ""}
                        ${hasStickyColumns && cellIndex === columnCount - 1 ? "sticky right-0 bg-white z-10 shadow-left" : ""}
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        {cellIndex === 0 && (
                          <Skeleton className="h-4 w-4 rounded-full" />
                        )}
                        <Skeleton className="h-4 flex-1 max-w-[120px]" />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200 space-y-3 sm:space-y-0">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  )
}

// Specific skeleton for appointments
export function AppointmentTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <TableSkeleton 
        rowCount={8} 
        columnCount={10} 
        hasStickyColumns={true}
      />
    </div>
  )
}