import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import { FaTrash, FaShoppingBag, FaLock, FaTruck, FaShieldAlt } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  useEffect(() => {
    let price = 0;
    products.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price);
  }, [products]);
  useEffect(() => {
    if (totalAmt <= 200) {
      setShippingCharge(30);
    } else if (totalAmt <= 400) {
      setShippingCharge(25);
    } else if (totalAmt > 401) {
      setShippingCharge(20);
    }
  }, [totalAmt]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Carrito" />
      {products.length > 0 ? (
        <div className="pb-20">
          {/* Cart Header */}
          <div className="w-full h-14 bg-primeColor text-white hidden lgl:grid grid-cols-5 place-content-center px-6 text-sm font-titleFont font-semibold rounded-t-lg">
            <h2 className="col-span-2">Producto</h2>
            <h2>Precio</h2>
            <h2>Cantidad</h2>
            <h2>Sub Total</h2>
          </div>

          {/* Cart Items */}
          <div className="border border-gray-200 border-t-0 lgl:border-t-0 rounded-b-lg overflow-hidden">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          {/* Cart Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <button
              onClick={() => dispatch(resetCart())}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium text-sm hover:bg-red-100 duration-300"
            >
              <FaTrash className="text-xs" /> Vaciar Carrito
            </button>
            <Link to="/tienda">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-100 duration-300">
                <FaShoppingBag className="text-xs" /> Seguir Comprando
              </button>
            </Link>
          </div>

          {/* Summary */}
          <div className="flex flex-col lg:flex-row gap-6 mt-8">
            {/* Trust Badges */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <FaTruck className="text-2xl text-primeColor flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-titleFont font-semibold text-sm">Envio a Todo el Peru</h3>
                  <p className="text-xs text-gray-500">Tu pedido llega hasta la puerta de tu casa con tracking</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <FaLock className="text-2xl text-primeColor flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-titleFont font-semibold text-sm">Pago Seguro</h3>
                  <p className="text-xs text-gray-500">Yape, Plin y transferencia bancaria</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <FaShieldAlt className="text-2xl text-primeColor flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-titleFont font-semibold text-sm">Productos Originales</h3>
                  <p className="text-xs text-gray-500">100% autenticos con garantia</p>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="w-full lg:w-[400px]">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primeColor text-white px-6 py-4">
                  <h2 className="font-titleFont font-bold text-lg">Resumen del Pedido</h2>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({products.length} {products.length === 1 ? "producto" : "productos"})</span>
                    <span className="font-semibold">S/.{Number(totalAmt).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Costo de envio</span>
                    <span className="font-semibold">S/.{Number(shippingCharge).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-1 flex items-center justify-between">
                    <span className="font-titleFont font-bold text-lg">Total</span>
                    <span className="font-titleFont font-bold text-xl text-primeColor">S/.{(Number(totalAmt) + Number(shippingCharge)).toFixed(2)}</span>
                  </div>
                  <Link to="/checkout" className="mt-2">
                    <button className="w-full h-12 bg-primeColor text-white font-titleFont font-semibold rounded-lg hover:bg-black duration-300 text-base">
                      Continuar con la Compra
                    </button>
                  </Link>
                  <p className="text-xs text-gray-400 text-center mt-1">Puedes comprar como invitado o con tu cuenta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6 pb-20 pt-4"
        >
          <div className="w-64 h-64 bg-gray-50 rounded-full flex items-center justify-center">
            <img className="w-48 p-4" src={emptyCart} alt="emptyCart" />
          </div>
          <div className="text-center max-w-md">
            <h1 className="font-titleFont text-2xl font-bold mb-2">Tu carrito esta vacio</h1>
            <p className="text-sm text-gray-500 mb-6">
              Parece que aun no has agregado nada. Explora nuestra tienda de perfumes, smartphones y accesorios tech.
            </p>
            <Link to="/tienda">
              <button className="px-10 h-12 bg-primeColor text-white rounded-lg font-titleFont font-semibold hover:bg-black duration-300">
                Explorar Tienda
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
