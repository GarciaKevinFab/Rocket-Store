import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCustomers } from "../../services/customerService";
import { FaSearch } from "react-icons/fa";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAllCustomers();
      setCustomers(data);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "todos" || (filter === "registrados" && c.type === "registrado") || (filter === "invitados" && c.type === "invitado");
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h1 className="text-2xl font-titleFont font-bold mb-6">Clientes</h1>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["todos", "registrados", "invitados"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors duration-200 ${filter === f ? "bg-primeColor text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p className="text-2xl font-bold">{customers.length}</p>
          <p className="text-sm text-gray-500">Total Clientes</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p className="text-2xl font-bold">{customers.filter((c) => c.type === "registrado").length}</p>
          <p className="text-sm text-gray-500">Registrados</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p className="text-2xl font-bold">{customers.filter((c) => c.type === "invitado").length}</p>
          <p className="text-sm text-gray-500">Invitados</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando clientes...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold">Pedidos</th>
                <th className="text-left px-4 py-3 font-semibold">Total Gastado</th>
                <th className="text-left px-4 py-3 font-semibold">Ultimo Pedido</th>
                <th className="text-left px-4 py-3 font-semibold">Accion</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{customer.name || "Sin nombre"}</div>
                    <div className="text-xs text-gray-500">{customer.email}</div>
                    {customer.phone && <div className="text-xs text-gray-400">{customer.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.type === "registrado" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                      {customer.type === "registrado" ? "Registrado" : "Invitado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{customer.totalOrders}</td>
                  <td className="px-4 py-3 font-semibold">S/.{customer.totalSpent.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(customer.lastOrderDate)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/clientes/${encodeURIComponent(customer.id)}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <p className="text-center text-gray-500 py-8">No se encontraron clientes</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
