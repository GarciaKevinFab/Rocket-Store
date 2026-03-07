import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCustomers } from "../../services/customerService";
import { FaSearch, FaUsers, FaUserCheck, FaUserClock } from "react-icons/fa";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (e) { console.error(e); }
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

  const registered = customers.filter((c) => c.type === "registrado").length;
  const guests = customers.filter((c) => c.type === "invitado").length;

  return (
    <div>
      <h1 className="text-2xl font-titleFont font-bold mb-6">Clientes</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Clientes", value: customers.length, icon: <FaUsers />, bg: "from-blue-500 to-blue-600" },
          { label: "Registrados", value: registered, icon: <FaUserCheck />, bg: "from-green-500 to-green-600" },
          { label: "Invitados", value: guests, icon: <FaUserClock />, bg: "from-orange-500 to-orange-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className={`bg-gradient-to-br ${stat.bg} text-white p-3 rounded-xl text-lg shadow-sm`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o email..." className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 text-sm" />
        </div>
        <div className="flex gap-2">
          {["todos", "registrados", "invitados"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${filter === f ? "bg-primeColor text-white shadow-sm" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse shadow-sm flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" /><div className="flex-1"><div className="h-4 bg-gray-200 rounded w-40 mb-2" /><div className="h-3 bg-gray-100 rounded w-56" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50/80">
              <tr>
                {["Cliente", "Tipo", "Pedidos", "Total Gastado", "Ultimo Pedido", "Accion"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-gray-50 hover:bg-gray-50/50 duration-150">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primeColor/10 rounded-full flex items-center justify-center text-primeColor font-bold text-sm">
                        {(customer.name || customer.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{customer.name || "Sin nombre"}</div>
                        <div className="text-xs text-gray-400">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer.type === "registrado" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {customer.type === "registrado" ? "Registrado" : "Invitado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{customer.totalOrders}</td>
                  <td className="px-4 py-3 font-bold">S/.{customer.totalSpent.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{formatDate(customer.lastOrderDate)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/clientes/${encodeURIComponent(customer.id)}`} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 duration-200">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12"><p className="text-4xl mb-2">👥</p><p className="text-gray-500">No se encontraron clientes</p></div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
