import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCustomerById, getCustomerOrders } from "../../services/customerService";
import { orderStatuses } from "../../constants/paymentConfig";
import { MdArrowBack } from "react-icons/md";

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedId = decodeURIComponent(id);
        const customerData = await getCustomerById(decodedId);
        if (customerData) {
          setCustomer(customerData);
          const customerOrders = await getCustomerOrders(customerData.email);
          setOrders(customerOrders);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const totalSpent = orders.reduce((acc, o) => o.status !== "cancelado" ? acc + (o.total || 0) : acc, 0);
  const nonCancelled = orders.filter((o) => o.status !== "cancelado");
  const avgOrder = nonCancelled.length > 0 ? totalSpent / nonCancelled.length : 0;

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-sm"><div className="h-5 bg-gray-200 rounded w-40 mb-3" /><div className="h-4 bg-gray-100 rounded w-64" /></div>)}
    </div>
  );
  if (!customer) return <p className="text-red-500">Cliente no encontrado</p>;

  return (
    <div>
      <button onClick={() => navigate("/admin/clientes")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primeColor mb-4 duration-200">
        <MdArrowBack /> Volver a Clientes
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primeColor/10 rounded-full flex items-center justify-center text-primeColor font-bold text-xl">
          {(customer.name || customer.email || "?").charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-titleFont font-bold">{customer.name || "Sin nombre"}</h1>
          <p className="text-sm text-gray-400">{customer.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${customer.type === "registrado" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {customer.type === "registrado" ? "Registrado" : "Invitado"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold mb-4">Informacion</h2>
            <div className="flex flex-col gap-3 text-sm">
              {customer.phone && <div><span className="text-gray-400 text-xs">Telefono</span><p className="font-medium">{customer.phone}</p></div>}
              {customer.address && (
                <div>
                  <span className="text-gray-400 text-xs">Direccion</span>
                  <p className="font-medium">{customer.address}{customer.district && `, ${customer.district}`}{customer.city && <><br />{customer.city}</>}{customer.department && `, ${customer.department}`}</p>
                </div>
              )}
              {customer.createdAt && <div><span className="text-gray-400 text-xs">Miembro desde</span><p className="font-medium">{formatDate(customer.createdAt)}</p></div>}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold mb-4">Resumen</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-primeColor">{orders.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Pedidos</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-primeColor">S/.{totalSpent.toFixed(0)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Gastado</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-primeColor">S/.{avgOrder.toFixed(0)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-lg mb-4">Historial de Pedidos ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8"><p className="text-3xl mb-2">📦</p><p className="text-gray-400 text-sm">Sin pedidos</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-gray-50/80">
                    <tr>
                      {["Pedido", "Fecha", "Total", "Estado", "Accion"].map((h) => (
                        <th key={h} className="text-left px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 duration-150">
                        <td className="px-3 py-2.5 font-mono text-xs text-primeColor">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-400">{formatDate(order.createdAt)}</td>
                        <td className="px-3 py-2.5 font-bold">S/.{order.total?.toFixed(2)}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
                            {orderStatuses[order.status]?.label || order.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <Link to={`/admin/pedidos/${order.id}`} className="text-xs text-blue-600 hover:underline font-medium">Ver</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
