import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus, updateOrderTracking } from "../../services/orderService";
import { orderStatuses } from "../../constants/paymentConfig";
import toast from "react-hot-toast";
import { FaTruck } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

const carriers = ["Olva Courier", "Shalom", "InDrive", "Rappi", "Cruz del Sur Cargo", "Otro"];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        if (data) {
          setOrder(data);
          setNewStatus(data.status);
          setNotes(data.notes || "");
          setTrackingNumber(data.tracking?.number || "");
          setTrackingCarrier(data.tracking?.carrier || "");
        }
      } catch (e) { console.error(e); }
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

  const inputClass = "w-full h-11 px-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 text-sm";

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-sm"><div className="h-5 bg-gray-200 rounded w-40 mb-3" /><div className="h-4 bg-gray-100 rounded w-64" /></div>)}
    </div>
  );
  if (!order) return <p className="text-red-500">Pedido no encontrado</p>;

  return (
    <div>
      <button onClick={() => navigate("/admin/pedidos")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primeColor mb-4 duration-200">
        <MdArrowBack /> Volver a Pedidos
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-titleFont font-bold">Pedido #{id.slice(-8).toUpperCase()}</h1>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
            {orderStatuses[order.status]?.label || order.status}
          </span>
          {order.isGuest && <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">Invitado</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg mb-4">Productos</h2>
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg shadow-sm" />}
              <div className="flex-1">
                <p className="font-medium text-sm">{item.productName}</p>
                <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">S/.{item.subtotal?.toFixed(2)}</p>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>S/.{order.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Envio</span><span>S/.{order.shippingCost?.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-bold mt-2 text-primeColor"><span>Total</span><span>S/.{order.total?.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold mb-3">Cliente</h2>
            <p className="text-sm font-medium">{order.userName}</p>
            <p className="text-sm text-gray-400">{order.userEmail || order.guestEmail}</p>
            <p className="text-sm text-gray-400">{order.userPhone}</p>
            <h3 className="font-semibold text-sm mt-4 mb-1">Direccion de envio</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.district}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.department}
              {order.shippingAddress?.reference && <><br /><span className="text-gray-400">Ref: {order.shippingAddress.reference}</span></>}
            </p>
            <p className="text-xs text-gray-400 mt-3 capitalize">Pago: {order.paymentMethod} | {formatDate(order.createdAt)}</p>
          </div>

          {/* Payment Proof */}
          {order.paymentProof && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold mb-3">Comprobante</h2>
              <img src={order.paymentProof} alt="Comprobante" className="w-full rounded-lg shadow-sm" />
            </div>
          )}

          {/* Status Update */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold mb-3">Actualizar Estado</h2>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={inputClass + " mb-3"}>
              {Object.entries(orderStatuses).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
            </select>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas del admin..." className="w-full h-20 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 resize-none text-sm mb-3" />
            <button onClick={handleUpdateStatus} disabled={updating} className="w-full h-10 bg-primeColor text-white rounded-lg hover:bg-black duration-300 disabled:opacity-50 text-sm font-medium">
              {updating ? "Actualizando..." : "Actualizar Estado"}
            </button>
          </div>

          {/* Shipping Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <FaTruck className="text-primeColor" /> Envio
            </h2>
            {order.tracking && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm">
                <p><span className="font-semibold">Transportista:</span> {order.tracking.carrier}</p>
                <p><span className="font-semibold">Guia:</span> {order.tracking.number}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <select value={trackingCarrier} onChange={(e) => setTrackingCarrier(e.target.value)} className={inputClass}>
                <option value="">Transportista...</option>
                {carriers.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Numero de guia" className={inputClass} />
              <button onClick={handleSaveTracking} disabled={savingTracking || !trackingNumber || !trackingCarrier} className="w-full h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 duration-300 disabled:opacity-50 text-sm font-medium">
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
