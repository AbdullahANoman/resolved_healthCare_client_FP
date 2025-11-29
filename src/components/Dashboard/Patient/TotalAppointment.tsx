import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface TotalAppointmentCountProps {
  totalAppointment: number;
  capacity: number;
  label: string;
}

export const TotalAppointmentCount: React.FC<TotalAppointmentCountProps> = ({
  totalAppointment,
  capacity,
  label,
}) => {
  const data = [
    { name: "Completed", totalAppointment },
    { name: "Remaining", totalAppointment: capacity - totalAppointment },
  ];

  const COLORS = ["#4B3ADC", "#F3F3F3"];

  return (
    <div className="flex items-center justify-between p-4 h-[100px] ">
      <div className="w-16 h-16 relative">
        <PieChart width={64} height={64}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={20}
            outerRadius={30}
            startAngle={90}
            endAngle={450}
            dataKey="totalAppointment"
            stroke="none"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {totalAppointment}
        </div>
      </div>
      <div>
        <p className="text-lg font-bold text-gray-800">
          {totalAppointment.toLocaleString()} appointments
        </p>
        <span className="text-gray-500 text-[12px]">{label}</span>
      </div>
    </div>
  );
};
