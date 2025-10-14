import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#14b8a6", "#6366f1", "#f97316", "#ef4444", "#22c55e"];

interface Props {
  data: { name: string; total: number }[];
}

const SalesPieChart: React.FC<Props> = ({ data }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border">
    <h3 className="font-semibold text-teal-600 mb-3 text-center">Ventas por Categoría</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="name" outerRadius={100} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default SalesPieChart;
