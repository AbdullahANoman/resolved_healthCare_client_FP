import { Plane } from "lucide-react"

interface TripStatsProps {
  totalTrips: number
  done: number
  booked: number
  canceled: number
}

export function TripsCard({ totalTrips = 1200, done = 620, booked = 465, canceled = 115 }: TripStatsProps) {
  const donePercentage = (done / totalTrips) * 100
  const bookedPercentage = (booked / totalTrips) * 100
  const canceledPercentage = (canceled / totalTrips) * 100

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm max-w-lg">
      <div className="flex items-center justify-between mb-4">
        {/* Left side with icon and total trips */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Booking</p>
            <p className="text-2xl font-bold text-gray-900">{totalTrips.toLocaleString()}</p>
          </div>
        </div>

        {/* Right side with status indicators */}
        <div className="flex flex-wrap gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Done</p>
            <p className="text-sm font-semibold text-gray-700">{done}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Booked</p>
            <p className="text-sm font-semibold text-sky-600">{booked}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Canceled</p>
            <p className="text-sm font-semibold text-blue-600">{canceled}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Done progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-xs text-gray-500">Done</div>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${donePercentage}%` }}
            />
          </div>
          <div className="w-12 text-xs text-gray-600 text-right">{Math.round(donePercentage)}%</div>
        </div>

        {/* Booked progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-xs text-gray-500">Booked</div>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="bg-sky-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${bookedPercentage}%` }}
            />
          </div>
          <div className="w-12 text-xs text-gray-600 text-right">{Math.round(bookedPercentage)}%</div>
        </div>

        {/* Canceled progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-xs text-gray-500">Canceled</div>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${canceledPercentage}%` }}
            />
          </div>
          <div className="w-12 text-xs text-gray-600 text-right">{Math.round(canceledPercentage)}%</div>
        </div>
      </div>
    </div>
  )
}
