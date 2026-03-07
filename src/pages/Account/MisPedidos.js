import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders } from "../../services/orderService";
import { orderStatuses } from "../../constants/paymentConfig";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { FaTruck } from "react-icons/fa";

const MisPedidos = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        const data = await getUserOrders(currentUser.uid);
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Mis Pedidos" />
      <div className="pb-20">
        <h2 className="text-2xl font-titleFont font-semibold mb-6">Historial de Pedidos</h2>
        {loading ? (
          <p className="text-gray-500">Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No tienes pedidos aun.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-gray-50 duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold">#{order.id.slice(-8).toUpperCase()}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
                      {orderStatuses[order.status]?.label || order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-2 md:mt-0">
                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                    <span className="font-semibold">S/.{order.total?.toFixed(2)}</span>
                    <span className="text-sm text-gray-400">{expandedOrder === order.id ? "\u25B2" : "\u25BC"}</span>
                  </div>
                </div>
                {expandedOrder === order.id && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Productos</h4>
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm py-1">
                            <span>{item.productName} x{item.quantity}</span>
                            <span>S/.{item.subtotal?.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t mt-2 pt-2">
                          <div className="flex justify-between text-sm"><span>Subtotal</span><span>S/.{order.subtotal?.toFixed(2)}</span></div>
                          <div className="flex justify-between text-sm"><span>Envio</span><span>S/.{order.shippingCost?.toFixed(2)}</span></div>
                          <div className="flex justify-between font-bold"><span>Total</span><span>S/.{order.total?.toFixed(2)}</span></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Envio a</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress?.address}, {order.shippingAddress?.district}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.department}
                          {order.shippingAddress?.reference && <><br />Ref: {order.shippingAddress.reference}</>}
                        </p>
                        <h4 className="font-semibold text-sm mt-3 mb-1">Metodo de pago</h4>
                        <p className="text-sm text-gray-600 capitalize">{order.paymentMethod}</p>
                        {order.tracking && (
                          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3">
                            <h4 className="font-semibold text-sm mb-1 flex items-center gap-1"><FaTruck className="text-blue-600" /> Tracking de Envio</h4>
                            <p className="text-sm text-blue-700"><span className="font-semibold">Transportista:</span> {order.tracking.carrier}</p>
                            <p className="text-sm text-blue-700"><span className="font-semibold">Guia:</span> {order.tracking.number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;
