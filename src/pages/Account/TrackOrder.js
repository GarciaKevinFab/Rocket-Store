import React, { useState } from "react";
import { getOrderByIdAndEmail } from "../../services/orderService";
import { orderStatuses } from "../../constants/paymentConfig";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Link } from "react-router-dom";
import { FaSearch, FaTruck, FaBox } from "react-icons/fa";
import toast from "react-hot-toast";

const TrackOrder = () => {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email || !orderId) {
      toast.error("Ingrese su email y numero de pedido");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const result = await getOrderByIdAndEmail(orderId.trim(), email.trim().toLowerCase());
      setOrder(result);
      if (!result) {
        toast.error("Pedido no encontrado. Verifique los datos.");
      }
    } catch (error) {
      toast.error("Error al buscar el pedido");
      setOrder(null);
    }
    setLoading(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const statusSteps = ["pendiente", "pago_verificado", "preparando", "enviado", "entregado"];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Rastrear Pedido" />
      <div className="pb-20">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-titleFont font-semibold mb-2 text-center">Rastrear tu Pedido</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Ingresa tu email y numero de pedido para ver el estado de tu compra</p>

          <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600">Correo Electronico</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none"
                type="email"
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600">ID del Pedido</label>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none"
                type="text"
                placeholder="Ej: abc123def456..."
              />
              <p className="text-xs text-gray-400 mt-1">El ID completo que recibiste al confirmar tu pedido</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primeColor text-white font-titleFont font-semibold rounded-md hover:bg-black duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaSearch />
              {loading ? "Buscando..." : "Buscar Pedido"}
            </button>
          </form>
        </div>

        {searched && !loading && !order && (
          <div className="max-w-lg mx-auto text-center py-8">
            <p className="text-gray-500">No se encontro ningun pedido con esos datos.</p>
            <p className="text-sm text-gray-400 mt-2">Verifica que el email y el ID del pedido sean correctos.</p>
          </div>
        )}

        {order && (
          <div className="max-w-2xl mx-auto">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-titleFont font-bold">Pedido #{order.id.slice(-8).toUpperCase()}</h3>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
                  {orderStatuses[order.status]?.label || order.status}
                </span>
              </div>

              {/* Status Progress */}
              {order.status !== "cancelado" && (
                <div className="flex items-center justify-between mb-2">
                  {statusSteps.map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i <= currentStepIndex ? "bg-primeColor text-white" : "bg-gray-200 text-gray-400"}`}>
                          {i <= currentStepIndex ? "\u2713" : i + 1}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 hidden sm:block">{orderStatuses[step]?.label}</span>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`flex-1 h-[2px] mx-1 ${i < currentStepIndex ? "bg-primeColor" : "bg-gray-200"}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
              {order.status === "cancelado" && (
                <p className="text-red-500 text-sm font-medium">Este pedido ha sido cancelado.</p>
              )}
            </div>

            {/* Tracking Info */}
            {order.tracking && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-titleFont font-semibold text-lg mb-3 flex items-center gap-2"><FaTruck className="text-primeColor" /> Informacion de Envio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Transportista</p>
                    <p className="font-medium">{order.tracking.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Numero de Guia</p>
                    <p className="font-medium font-mono">{order.tracking.number}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-titleFont font-semibold text-lg mb-3 flex items-center gap-2"><FaBox className="text-primeColor" /> Productos</h3>
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="w-14 h-14 object-cover rounded" />}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">S/.{item.subtotal?.toFixed(2)}</p>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>S/.{order.subtotal?.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Envio</span><span>S/.{order.shippingCost?.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-1"><span>Total</span><span>S/.{order.total?.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-titleFont font-semibold text-lg mb-3">Direccion de Envio</h3>
              <p className="text-sm text-gray-600">
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.district}, {order.shippingAddress?.city}<br />
                {order.shippingAddress?.department}
                {order.shippingAddress?.reference && <><br />Ref: {order.shippingAddress.reference}</>}
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link to="/tienda" className="text-primeColor hover:text-black text-sm font-medium duration-300">
                &larr; Volver a la Tienda
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
