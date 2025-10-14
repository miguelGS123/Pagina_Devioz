import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface Props {
  data: { month: string; total: number }[];
}

const SalesLineChart: React.FC<Props> = ({ data }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border">
    <h3 className="font-semibold text-teal-600 mb-3 text-center">Evolución Mensual de Ventas</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesLineChart;
