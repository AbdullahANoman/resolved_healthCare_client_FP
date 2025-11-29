"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Dot } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 400, fullMonth: "January" },
  { month: "Feb", revenue: 300, fullMonth: "February" },
  { month: "Mar", revenue: 450, fullMonth: "March" },
  { month: "Apr", revenue: 635, fullMonth: "April" },
  { month: "May", revenue: 500, fullMonth: "May" },
  { month: "Jun", revenue: 550, fullMonth: "June" },
  { month: "Jul", revenue: 480, fullMonth: "July" },
  { month: "Aug", revenue: 520, fullMonth: "August" },
  { month: "Sep", revenue: 590, fullMonth: "September" },
  { month: "Oct", revenue: 610, fullMonth: "October" },
  { month: "Nov", revenue: 580, fullMonth: "November" },
  { month: "Dec", revenue: 650, fullMonth: "December" },
]

const CustomDot = (props: any) => {
  const { cx, cy, payload, onClick } = props
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={4}
      fill="#3B82F6"
      stroke="#3B82F6"
      strokeWidth={2}
      style={{ cursor: "pointer" }}
      onClick={() => onClick(payload)}
    />
  )
}

export function RevenueChart() {
  const [selectedPoint, setSelectedPoint] = useState<{ month: string; revenue: number; fullMonth: string } | null>(null)

  const handlePointClick = (data: any) => {
    console.log("[v0] Clicked data:", data)
    setSelectedPoint(data)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Revenue Overview</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="h-8 bg-blue-500 text-white border-blue-500 hover:bg-blue-700 hover:text-white hover:font-semibold duration-200"
        >
          Monthly
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        {selectedPoint && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              {selectedPoint.fullMonth}: ${selectedPoint.revenue} revenue
            </p>
          </div>
        )}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(value) => `$${value}`}
                domain={[0, 800]}
                ticks={[0, 200, 400, 600, 800]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={<CustomDot onClick={handlePointClick} />}
                activeDot={{ r: 6, fill: "#3B82F6", cursor: "pointer" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
