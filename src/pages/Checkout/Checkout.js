import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import { resetCart } from "../../redux/orebiSlice";
import { paymentMethods, peruDepartments } from "../../constants/paymentConfig";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";

const Checkout = () => {
  const cartProducts = useSelector((state) => state.orebiReducer.products);
  const { currentUser, userData } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Shipping info
  const [shipping, setShipping] = useState({
    name: userData?.displayName || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    district: userData?.district || "",
    city: userData?.city || "",
    department: userData?.department || "",
    reference: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  // Totals
  const subtotal = cartProducts.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const shippingCost = subtotal <= 200 ? 30 : subtotal <= 400 ? 25 : 20;
  const total = subtotal + shippingCost;

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  if (!currentUser) {
    navigate("/signin");
    return null;
  }

  if (cartProducts.length === 0 && !orderId) {
    navigate("/cart");
    return null;
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.phone || !shipping.address || !shipping.district || !shipping.city || !shipping.department) {
      toast.error("Complete todos los campos de envio");
      return;
    }
    setStep(2);
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setStep(3);
  };

  const handleSubmitOrder = async () => {
    if (!proofFile) {
      toast.error("Suba su comprobante de pago");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: shipping.name,
        userPhone: shipping.phone,
        shippingAddress: {
          address: shipping.address,
          district: shipping.district,
          city: shipping.city,
          department: shipping.department,
          reference: shipping.reference,
        },
        items: cartProducts.map((item) => ({
          productId: item._id,
          productName: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          imageUrl: item.image,
          subtotal: Number(item.price) * item.quantity,
        })),
        subtotal,
        shippingCost,
        total,
        paymentMethod,
      };

      const id = await createOrder(orderData, proofFile);
      setOrderId(id);
      dispatch(resetCart());
      setStep(4);
      toast.success("Pedido registrado exitosamente!");
    } catch (error) {
      toast.error("Error al crear el pedido. Intente de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Checkout" />
      <div className="pb-20">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10 gap-2">
          {["Envio", "Pago", "Comprobante", "Confirmacion"].map((label, i) => (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-2 ${step > i ? "text-primeColor" : "text-gray-400"}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i ? "bg-primeColor text-white" : step === i + 1 ? "bg-primeColor text-white" : "bg-gray-200"}`}>
                  {step > i + 1 ? "\u2713" : i + 1}
                </span>
                <span className="text-sm font-medium hidden md:block">{label}</span>
              </div>
              {i < 3 && <div className={`w-12 h-[2px] ${step > i + 1 ? "bg-primeColor" : "bg-gray-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Shipping */}
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} className="max-w-lg mx-auto">
            <h2 className="text-2xl font-titleFont font-semibold mb-6">Datos de Envio</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-titleFont text-sm font-semibold text-gray-600">Nombre completo</label>
                <input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
              </div>
              <div>
                <label className="font-titleFont text-sm font-semibold text-gray-600">Telefono</label>
                <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
              </div>
              <div>
                <label className="font-titleFont text-sm font-semibold text-gray-600">Direccion</label>
                <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-titleFont text-sm font-semibold text-gray-600">Departamento</label>
                  <select value={shipping.department} onChange={(e) => setShipping({ ...shipping, department: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none bg-white">
                    <option value="">Seleccionar</option>
                    {peruDepartments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-titleFont text-sm font-semibold text-gray-600">Ciudad</label>
                  <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
                </div>
              </div>
              <div>
                <label className="font-titleFont text-sm font-semibold text-gray-600">Distrito</label>
                <input value={shipping.district} onChange={(e) => setShipping({ ...shipping, district: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
              </div>
              <div>
                <label className="font-titleFont text-sm font-semibold text-gray-600">Referencia (opcional)</label>
                <input value={shipping.reference} onChange={(e) => setShipping({ ...shipping, reference: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" placeholder="Ej: Frente al parque Kennedy" />
              </div>
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h3 className="font-titleFont font-semibold mb-2">Resumen del Pedido</h3>
                {cartProducts.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>S/.{(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between text-sm"><span>Subtotal</span><span>S/.{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Envio</span><span>S/.{shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-1"><span>Total</span><span>S/.{total.toFixed(2)}</span></div>
              </div>
              <button type="submit" className="w-full h-12 bg-primeColor text-white font-titleFont font-semibold rounded-md hover:bg-black duration-300 mt-2">
                Continuar al Pago
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-titleFont font-semibold mb-6">Metodo de Pago</h2>
            <div className="flex flex-col gap-4">
              {Object.entries(paymentMethods).map(([key, method]) => (
                <div
                  key={key}
                  onClick={() => handlePaymentSelect(key)}
                  className={`border-2 rounded-lg p-6 cursor-pointer hover:border-primeColor duration-300 ${paymentMethod === key ? "border-primeColor bg-gray-50" : "border-gray-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: method.color }}>
                      {method.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-titleFont font-semibold text-lg">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.instructions}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-primeColor mt-2">
                &larr; Volver a datos de envio
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Instructions + Proof Upload */}
        {step === 3 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-titleFont font-semibold mb-6">Instrucciones de Pago</h2>
            <div className="bg-gray-50 border rounded-lg p-6 mb-6">
              <h3 className="font-titleFont font-semibold text-lg mb-3" style={{ color: paymentMethods[paymentMethod]?.color }}>
                {paymentMethods[paymentMethod]?.name}
              </h3>
              <p className="text-3xl font-bold text-primeColor mb-4">S/.{total.toFixed(2)}</p>
              {paymentMethod === "transferencia" ? (
                <div className="flex flex-col gap-2 text-sm">
                  <p><span className="font-semibold">Banco:</span> {paymentMethods.transferencia.bank}</p>
                  <p><span className="font-semibold">Cuenta:</span> {paymentMethods.transferencia.accountNumber}</p>
                  <p><span className="font-semibold">CCI:</span> {paymentMethods.transferencia.cci}</p>
                  <p><span className="font-semibold">Titular:</span> {paymentMethods.transferencia.holder}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  <p><span className="font-semibold">Numero:</span> {paymentMethods[paymentMethod]?.number}</p>
                  <p><span className="font-semibold">Titular:</span> {paymentMethods[paymentMethod]?.holder}</p>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-4">{paymentMethods[paymentMethod]?.instructions}</p>
            </div>

            <h3 className="font-titleFont font-semibold mb-3">Subir Comprobante de Pago</h3>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? "border-primeColor bg-gray-50" : "border-gray-300 hover:border-primeColor"}`}
            >
              <input {...getInputProps()} />
              {proofPreview ? (
                <div>
                  <img src={proofPreview} alt="Comprobante" className="max-h-48 mx-auto rounded-md" />
                  <p className="text-sm text-green-600 mt-2">Comprobante cargado. Haga clic para cambiar.</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500">Arrastra tu comprobante aqui o haz clic para seleccionar</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 h-12 border border-gray-400 rounded-md hover:bg-gray-50 duration-300">
                Atras
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={!proofFile || loading}
                className="flex-1 h-12 bg-primeColor text-white font-titleFont font-semibold rounded-md hover:bg-black duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="max-w-lg mx-auto text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-titleFont font-semibold mb-2">Pedido Registrado!</h2>
            <p className="text-gray-600 mb-2">Tu pedido <span className="font-bold">#{orderId?.slice(-8).toUpperCase()}</span> ha sido registrado exitosamente.</p>
            <p className="text-sm text-gray-500 mb-6">Verificaremos tu pago y te notificaremos cuando tu pedido este en camino.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Estado del pedido:</h3>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Pendiente de verificacion</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate("/mis-pedidos")} className="flex-1 h-12 bg-primeColor text-white rounded-md hover:bg-black duration-300">
                Ver Mis Pedidos
              </button>
              <button onClick={() => navigate("/tienda")} className="flex-1 h-12 border border-primeColor text-primeColor rounded-md hover:bg-gray-50 duration-300">
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
