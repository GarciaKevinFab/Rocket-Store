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
    const data = await getAllOrders(status === "todos" ? null : status);
    setOrders(data);
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === tab.key ? "bg-primeColor text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm min-w-[850px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Pedido</th>
                <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold">Total</th>
                <th className="text-left px-4 py-3 font-semibold">Pago</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-left px-4 py-3 font-semibold">Envio</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold">Accion</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div>{order.userName}</div>
                    <div className="text-xs text-gray-500">{order.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">S/.{order.total?.toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
                      {orderStatuses[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.tracking ? (
                      <span className="text-green-600 flex items-center gap-1 text-xs" title={`${order.tracking.carrier}: ${order.tracking.number}`}>
                        <FaTruck /> {order.tracking.carrier}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">---</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/pedidos/${order.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hay pedidos</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
