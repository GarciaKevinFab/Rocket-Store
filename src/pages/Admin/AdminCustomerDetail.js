import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCustomerById, getCustomerOrders } from "../../services/customerService";
import { orderStatuses } from "../../constants/paymentConfig";

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const decodedId = decodeURIComponent(id);
      const customerData = await getCustomerById(decodedId);
      if (customerData) {
        setCustomer(customerData);
        const customerOrders = await getCustomerOrders(customerData.email);
        setOrders(customerOrders);
      }
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
  const avgOrder = orders.length > 0 ? totalSpent / orders.filter((o) => o.status !== "cancelado").length : 0;

  if (loading) return <p className="text-gray-500">Cargando cliente...</p>;
  if (!customer) return <p className="text-red-500">Cliente no encontrado</p>;

  return (
    <div>
      <button onClick={() => navigate("/admin/clientes")} className="text-sm text-gray-500 hover:text-primeColor mb-4 block">
        &larr; Volver a Clientes
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-titleFont font-bold">{customer.name || "Sin nombre"}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${customer.type === "registrado" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
          {customer.type === "registrado" ? "Registrado" : "Invitado"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-3">Informacion del Cliente</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <span className="text-gray-500">Telefono:</span>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              )}
              {customer.address && (
                <div>
                  <span className="text-gray-500">Direccion:</span>
                  <p className="font-medium">
                    {customer.address}
                    {customer.district && `, ${customer.district}`}
                    {customer.city && <><br />{customer.city}</>}
                    {customer.department && `, ${customer.department}`}
                  </p>
                </div>
              )}
              {customer.createdAt && (
                <div>
                  <span className="text-gray-500">Miembro desde:</span>
                  <p className="font-medium">{formatDate(customer.createdAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-3">Resumen</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-xs text-gray-500">Pedidos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">S/.{totalSpent.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Total Gastado</p>
              </div>
              <div className="text-center col-span-2">
                <p className="text-2xl font-bold">S/.{(avgOrder || 0).toFixed(2)}</p>
                <p className="text-xs text-gray-500">Pedido Promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-4">Historial de Pedidos ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-sm">Este cliente no tiene pedidos.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold">Pedido</th>
                      <th className="text-left px-3 py-2 font-semibold">Fecha</th>
                      <th className="text-left px-3 py-2 font-semibold">Total</th>
                      <th className="text-left px-3 py-2 font-semibold">Estado</th>
                      <th className="text-left px-3 py-2 font-semibold">Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="px-3 py-2 font-semibold">S/.{order.total?.toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
                            {orderStatuses[order.status]?.label || order.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <Link to={`/admin/pedidos/${order.id}`} className="text-blue-600 hover:text-blue-800 text-xs">
                            Ver
                          </Link>
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
