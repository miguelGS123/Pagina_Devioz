import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  data: { name: string; total: number }[];
}

const SalesBarChart: React.FC<Props> = ({ data }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border">
    <h3 className="font-semibold text-teal-600 mb-3 text-center">Ventas por Producto</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#14b8a6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SalesBarChart;
