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
  // 🧩 Filtros
  const [selectedProduct, setSelectedProduct] = useState("Todos");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // 🧮 Filtrar ventas según producto y fecha
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      const matchProducto =
        selectedProduct === "Todos" || v.producto.nombre === selectedProduct;
      const matchFecha =
        !selectedDate || v.fecha.startsWith(selectedDate); // formato yyyy-mm-dd
      return matchProducto && matchFecha;
    });
  }, [ventas, selectedProduct, selectedDate]);

  // 📊 Agrupación de datos
  const ventasPorProducto = useMemo(() => {
    const map = new Map<string, number>();
    ventasFiltradas.forEach((v) => {
      const nombre = v.producto.nombre;
      map.set(nombre, (map.get(nombre) || 0) + v.total);
    });
    return Array.from(map, ([name, total]) => ({ name, total }));
  }, [ventasFiltradas]);

  const ventasPorCategoria = useMemo(() => {
    const map = new Map<string, number>();
    ventasFiltradas.forEach((v) => {
      const categoria = v.producto.categoria || "Sin categoría";
      map.set(categoria, (map.get(categoria) || 0) + v.total);
    });
    return Array.from(map, ([name, total]) => ({ name, total }));
  }, [ventasFiltradas]);

  // 📈 Evolución diaria (día/mes/año)
  const ventasPorDia = useMemo(() => {
    const map = new Map<string, number>();
    ventasFiltradas.forEach((v) => {
      const fecha = new Date(v.fecha);
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const anio = fecha.getFullYear();
      const clave = `${dia}/${mes}/${anio}`;
      map.set(clave, (map.get(clave) || 0) + v.total);
    });

    const datosOrdenados = Array.from(map, ([fecha, total]) => ({ fecha, total })).sort(
      (a, b) =>
        new Date(a.fecha.split("/").reverse().join("-")).getTime() -
        new Date(b.fecha.split("/").reverse().join("-")).getTime()
    );

    return datosOrdenados;
  }, [ventasFiltradas]);

  // 📦 KPIs
  const totalVentas = ventasFiltradas.reduce((a, b) => a + b.total, 0);
  const totalProductos = ventasFiltradas.reduce((a, b) => a + b.cantidad, 0);
  const productosUnicos = new Set(
    ventasFiltradas.map((v) => v.producto.nombre)
  ).size;
  const masVendido =
    ventasPorProducto.sort((a, b) => b.total - a.total)[0]?.name || "—";

  // 🔁 Resetear filtros
  const limpiarFiltros = () => {
    setSelectedProduct("Todos");
    setSelectedDate("");
  };

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
      <div className="flex flex-wrap gap-3 justify-end mb-6 items-center">
        {/* Filtro de producto */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option>Todos</option>
          {Array.from(new Set(ventas.map((v) => v.producto.nombre))).map(
            (nombre) => (
              <option key={nombre}>{nombre}</option>
            )
          )}
        </select>

        {/* Filtro de fecha */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        />

        {/* Botón para limpiar */}
        <button
          onClick={limpiarFiltros}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-500 transition"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ventasPorProducto.length > 0 ? (
          <SalesBarChart data={ventasPorProducto} />
        ) : (
          <p className="text-gray-500 text-center col-span-2">
            No hay datos para mostrar en el gráfico de productos.
          </p>
        )}

        {ventasPorCategoria.length > 0 ? (
          <SalesPieChart data={ventasPorCategoria} />
        ) : (
          <p className="text-gray-500 text-center col-span-2">
            No hay datos para mostrar en el gráfico de categorías.
          </p>
        )}

        <div className="col-span-full">
          {ventasPorDia.length > 0 ? (
            <SalesLineChart data={ventasPorDia} />
          ) : (
            <p className="text-gray-500 text-center">
              No hay datos para mostrar en el gráfico de ventas por día.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSalesDashboard;
