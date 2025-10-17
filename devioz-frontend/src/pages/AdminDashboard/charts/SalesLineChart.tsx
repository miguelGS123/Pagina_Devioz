import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { fecha: string; total: number }[];
}

const SalesLineChart: React.FC<Props> = ({ data }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border">
    <h3 className="font-semibold text-teal-600 mb-3 text-center">
      Evolución Diaria de Ventas
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        {/* ❌ Ocultamos las etiquetas del eje X */}
        <XAxis dataKey="fecha" tick={false} axisLine={false} />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`S/ ${value.toFixed(2)}`, "Total"]}
          labelFormatter={(label: string) => `Fecha: ${label}`}
          contentStyle={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
          labelStyle={{ color: "#0f766e", fontWeight: 600 }}
          itemStyle={{ color: "#14b8a6" }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#14b8a6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesLineChart;
