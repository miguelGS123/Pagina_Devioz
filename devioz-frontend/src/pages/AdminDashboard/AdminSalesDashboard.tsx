import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Venta } from "./AdminSalesTable";
import SalesBarChart from "./charts/SalesBarChart";
import SalesPieChart from "./charts/SalesPieChart";
import SalesLineChart from "./charts/SalesLineChart";

interface Props {
  ventas: Venta[];
}

const AdminSalesDashboard: React.FC<Props> = ({ ventas }) => {
  const [selectedProduct, setSelectedProduct] = useState("Todos");

  // 📊 Agrupación de datos
  const ventasPorProducto = useMemo(() => {
    const map = new Map<string, number>();
    ventas.forEach((v) => {
      const nombre = v.producto.nombre;
      map.set(nombre, (map.get(nombre) || 0) + v.total);
    });
    return Array.from(map, ([name, total]) => ({ name, total }));
  }, [ventas]);

  const ventasPorCategoria = useMemo(() => {
    const map = new Map<string, number>();
    ventas.forEach((v) => {
      const categoria = v.producto.categoria || "Sin categoría";
      map.set(categoria, (map.get(categoria) || 0) + v.total);
    });
    return Array.from(map, ([name, total]) => ({ name, total }));
  }, [ventas]);

  const ventasPorMes = useMemo(() => {
    const map = new Map<string, number>();
    ventas.forEach((v) => {
      const fecha = new Date(v.fecha);
      const mes = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      map.set(mes, (map.get(mes) || 0) + v.total);
    });
    return Array.from(map, ([month, total]) => ({ month, total }));
  }, [ventas]);

  // 📦 KPIs
  const totalVentas = ventas.reduce((a, b) => a + b.total, 0);
  const totalProductos = ventas.reduce((a, b) => a + b.cantidad, 0);
  const productosUnicos = new Set(ventas.map((v) => v.producto.nombre)).size;

  const masVendido =
    ventasPorProducto.sort((a, b) => b.total - a.total)[0]?.name || "—";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-teal-600 mb-6">
        📈 Dashboard de Ventas
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Ventas", value: `S/ ${totalVentas.toFixed(2)}`, icon: "💰" },
          { label: "Productos Vendidos", value: totalProductos, icon: "📦" },
          { label: "Productos únicos", value: productosUnicos, icon: "🛒" },
          { label: "Más Vendido", value: masVendido, icon: "🔥" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-50 border p-4 rounded-lg shadow-sm text-center"
          >
            <div className="text-2xl">{kpi.icon}</div>
            <h3 className="text-sm text-gray-500">{kpi.label}</h3>
            <p className="font-bold text-lg text-teal-700">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex justify-end mb-6">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option>Todos</option>
          {ventasPorProducto.map((v) => (
            <option key={v.name}>{v.name}</option>
          ))}
        </select>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesBarChart data={ventasPorProducto} />
        <SalesPieChart data={ventasPorCategoria} />
        <div className="col-span-full">
          <SalesLineChart data={ventasPorMes} />
        </div>
      </div>
    </div>
  );
};

export default AdminSalesDashboard;
