import React from "react";
import { Search } from "lucide-react";

interface Props {
  search: string;
  categoria: string;
  orden: string;
  setSearch: (v: string) => void;
  setCategoria: (v: string) => void;
  setOrden: (v: string) => void;
}

const DashboardFilters: React.FC<Props> = ({
  search,
  categoria,
  orden,
  setSearch,
  setCategoria,
  setOrden,
}) => (
  <section className="bg-gray-50 border-b py-4">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-between items-center">
      <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-full sm:w-1/3">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Buscar producto..."
          className="outline-none flex-1 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option>Todos</option>
        <option>Teclados</option>
        <option>Mouse</option>
        <option>Monitores</option>
        <option>Laptops</option>
        <option>Accesorios</option>
      </select>

      <select
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="relevancia">Relevancia</option>
        <option value="precio-asc">Precio ↑</option>
        <option value="precio-desc">Precio ↓</option>
      </select>
    </div>
  </section>
);

export default DashboardFilters;
