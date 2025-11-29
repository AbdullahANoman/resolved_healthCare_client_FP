"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const destinationsData = [
  { name: "Tokyo, Japan", value: 35, participants: 2458, color: "#1E40AF" },
  { name: "Sydney, Australia", value: 28, participants: 2458, color: "#3B82F6" },
  { name: "Paris, France", value: 22, participants: 2458, color: "#60A5FA" },
  { name: "Venice, Italy", value: 15, participants: 2458, color: "#93C5FD" },
]

export function DestinationsChart() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Top Destinations</CardTitle>
        <Button variant="outline" size="sm" className="h-8 bg-blue-500 text-white border-blue-500 hover:bg-blue-700 hover:text-white hover:font-semibold duration-200">
          This Month
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={destinationsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {destinationsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {destinationsData.map((destination, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: destination.color }} />
                  <span className="text-sm font-medium text-gray-900">
                    {destination.name} ({destination.value}%)
                  </span>
                </div>
                <span className="text-xs text-gray-500">{destination.participants.toLocaleString()} Participants</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
