import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus, updateOrderTracking } from "../../services/orderService";
import { orderStatuses } from "../../constants/paymentConfig";
import toast from "react-hot-toast";
import { FaTruck } from "react-icons/fa";

const carriers = ["Olva Courier", "Shalom", "InDrive", "Rappi", "Cruz del Sur Cargo", "Otro"];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Tracking state
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderById(id);
      if (data) {
        setOrder(data);
        setNewStatus(data.status);
        setNotes(data.notes || "");
        setTrackingNumber(data.tracking?.number || "");
        setTrackingCarrier(data.tracking?.carrier || "");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus, notes);
      toast.success("Estado actualizado!");
      setOrder({ ...order, status: newStatus, notes });
    } catch (error) {
      toast.error("Error al actualizar");
    }
    setUpdating(false);
  };

  const handleSaveTracking = async () => {
    if (!trackingNumber || !trackingCarrier) {
      toast.error("Ingrese numero de guia y transportista");
      return;
    }
    setSavingTracking(true);
    try {
      await updateOrderTracking(id, trackingNumber, trackingCarrier);
      toast.success("Tracking actualizado!");
      setOrder({ ...order, tracking: { number: trackingNumber, carrier: trackingCarrier } });
    } catch (error) {
      toast.error("Error al guardar tracking");
    }
    setSavingTracking(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <p className="text-gray-500">Cargando pedido...</p>;
  if (!order) return <p className="text-red-500">Pedido no encontrado</p>;

  return (
    <div>
      <button onClick={() => navigate("/admin/pedidos")} className="text-sm text-gray-500 hover:text-primeColor mb-4 block">
        &larr; Volver a Pedidos
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-titleFont font-bold">Pedido #{id.slice(-8).toUpperCase()}</h1>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
            {orderStatuses[order.status]?.label || order.status}
          </span>
          {order.isGuest && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">Invitado</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Productos</h2>
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="w-16 h-16 object-cover rounded" />}
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-semibold">S/.{item.subtotal?.toFixed(2)}</p>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>S/.{order.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Envio</span><span>S/.{order.shippingCost?.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-bold mt-2"><span>Total</span><span>S/.{order.total?.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-3">Cliente</h2>
            <p className="text-sm">{order.userName}</p>
            <p className="text-sm text-gray-500">{order.userEmail || order.guestEmail}</p>
            <p className="text-sm text-gray-500">{order.userPhone}</p>
            <h3 className="font-semibold text-sm mt-4 mb-1">Direccion de envio</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.district}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.department}
              {order.shippingAddress?.reference && <><br />Ref: {order.shippingAddress.reference}</>}
            </p>
            <h3 className="font-semibold text-sm mt-4 mb-1">Metodo de pago</h3>
            <p className="text-sm capitalize">{order.paymentMethod}</p>
            <p className="text-xs text-gray-400 mt-2">Fecha: {formatDate(order.createdAt)}</p>
          </div>

          {/* Payment Proof */}
          {order.paymentProof && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-semibold text-lg mb-3">Comprobante de Pago</h2>
              <img src={order.paymentProof} alt="Comprobante" className="w-full rounded-md" />
            </div>
          )}

          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-3">Actualizar Estado</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none bg-white mb-3"
            >
              {Object.entries(orderStatuses).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas del admin (opcional)"
              className="w-full h-20 px-4 py-2 border border-gray-300 rounded-md outline-none resize-none mb-3"
            />
            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="w-full h-10 bg-primeColor text-white rounded-md hover:bg-black duration-300 disabled:opacity-50 text-sm font-medium"
            >
              {updating ? "Actualizando..." : "Actualizar Estado"}
            </button>
          </div>

          {/* Shipping Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaTruck className="text-primeColor" /> Informacion de Envio
            </h2>
            {order.tracking && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 text-sm">
                <p><span className="font-semibold">Transportista:</span> {order.tracking.carrier}</p>
                <p><span className="font-semibold">Guia:</span> {order.tracking.number}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Transportista</label>
                <select
                  value={trackingCarrier}
                  onChange={(e) => setTrackingCarrier(e.target.value)}
                  className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none bg-white"
                >
                  <option value="">Seleccionar</option>
                  {carriers.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Numero de Guia</label>
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ej: OC-123456789"
                  className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none"
                />
              </div>
              <button
                onClick={handleSaveTracking}
                disabled={savingTracking || !trackingNumber || !trackingCarrier}
                className="w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 duration-300 disabled:opacity-50 text-sm font-medium"
              >
                {savingTracking ? "Guardando..." : "Guardar Tracking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
