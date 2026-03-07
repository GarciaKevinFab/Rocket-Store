import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../services/orderService";
import { orderStatuses } from "../../constants/paymentConfig";
import { FaTruck } from "react-icons/fa";

const statusTabs = [
  { key: "todos", label: "Todos" },
  { key: "pendiente", label: "Pendientes" },
  { key: "pago_verificado", label: "Verificados" },
  { key: "preparando", label: "Preparando" },
  { key: "enviado", label: "Enviados" },
  { key: "entregado", label: "Entregados" },
  { key: "cancelado", label: "Cancelados" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todos");

  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const data = await getAllOrders(status === "todos" ? null : status);
      setOrders(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(activeTab); }, [activeTab]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <h1 className="text-2xl font-titleFont font-bold mb-6">Pedidos</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-primeColor text-white shadow-sm"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse shadow-sm">
              <div className="flex gap-4"><div className="h-4 bg-gray-200 rounded w-20" /><div className="h-4 bg-gray-200 rounded w-32" /><div className="h-4 bg-gray-100 rounded w-16" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[850px]">
            <thead className="bg-gray-50/80">
              <tr>
                {["Pedido", "Cliente", "Total", "Pago", "Estado", "Envio", "Fecha", "Accion"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 duration-150">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-primeColor">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{order.userName}</div>
                    <div className="text-xs text-gray-400">{order.userEmail || order.guestEmail}</div>
                  </td>
                  <td className="px-4 py-3 font-bold">S/.{order.total?.toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
                      {orderStatuses[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.tracking ? (
                      <span className="text-green-600 flex items-center gap-1.5 text-xs font-medium">
                        <FaTruck /> {order.tracking.carrier}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">Sin envio</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/pedidos/${order.id}`} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 duration-200">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-12"><p className="text-4xl mb-2">📋</p><p className="text-gray-500">No hay pedidos</p></div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
