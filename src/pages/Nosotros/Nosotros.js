import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { FaShieldAlt, FaTruck, FaHeadset, FaStar, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { MdPayment } from "react-icons/md";

const Nosotros = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    if (location.state?.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);

  const features = [
    { icon: <FaShieldAlt className="text-3xl" />, title: "100% Originales", desc: "Todos nuestros productos son originales e importados directamente. Garantizamos autenticidad en cada compra." },
    { icon: <FaTruck className="text-3xl" />, title: "Envio a Todo el Peru", desc: "Realizamos envios a nivel nacional. Tu pedido llega a la puerta de tu casa con seguimiento en tiempo real." },
    { icon: <FaHeadset className="text-3xl" />, title: "Atencion Personalizada", desc: "Nuestro equipo esta disponible para ayudarte antes, durante y despues de tu compra por WhatsApp e Instagram." },
    { icon: <MdPayment className="text-3xl" />, title: "Pago Facil y Seguro", desc: "Aceptamos Yape, Plin y transferencia bancaria. Metodos seguros y accesibles para todos." },
  ];

  const stats = [
    { number: "500+", label: "Clientes Satisfechos" },
    { number: "1000+", label: "Productos Vendidos" },
    { number: "25", label: "Departamentos Cubiertos" },
    { number: "4.9", label: "Calificacion Promedio", icon: <FaStar className="text-yellow-400 inline" /> },
  ];

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Sobre Nosotros" prevLocation={prevLocation} />

      {/* Hero Section */}
      <div className="pb-20">
        <div className="bg-gradient-to-br from-primeColor to-gray-800 rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-medium mb-4">Tu tienda de confianza en Peru</span>
            <h1 className="font-titleFont text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Bienvenido a <span className="text-yellow-300">RUME IMPORT</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Somos una tienda online peruana dedicada a traerte los mejores perfumes originales, smartphones de ultima generacion, accesorios tech y productos de cuidado personal. Trabajamos directamente con proveedores internacionales para ofrecerte productos autenticos a precios competitivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/tienda">
                <button className="w-full sm:w-auto px-8 h-12 bg-white text-primeColor font-titleFont font-semibold rounded-lg hover:bg-gray-100 duration-300">
                  Ver Productos
                </button>
              </Link>
              <a href="https://www.instagram.com/rume_import" target="_blank" rel="noreferrer">
                <button className="w-full sm:w-auto px-8 h-12 border-2 border-white text-white font-titleFont font-semibold rounded-lg hover:bg-white/10 duration-300 flex items-center justify-center gap-2">
                  <FaInstagram /> Siguenos
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl md:text-4xl font-bold text-primeColor font-titleFont">
                {stat.number} {stat.icon}
              </p>
              <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Nuestra Mision */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-titleFont text-2xl md:text-3xl font-bold mb-3">Nuestra Mision</h2>
            <div className="w-16 h-1 bg-primeColor mx-auto rounded-full"></div>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              En RUME IMPORT nos comprometemos a acercar productos de calidad internacional a todo el Peru. Creemos que todos merecen acceso a tecnologia de punta y productos de lujo a precios justos, con la comodidad de comprar desde casa.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Cada producto que ofrecemos pasa por un riguroso control de calidad. Desde perfumes de marcas como Dior, Paco Rabanne y Carolina Herrera, hasta los ultimos modelos de iPhone y Samsung, todo es 100% original y con garantia.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-titleFont text-2xl md:text-3xl font-bold mb-3">Por que elegirnos?</h2>
            <div className="w-16 h-1 bg-primeColor mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-primeColor mb-4">
                  {f.icon}
                </div>
                <h3 className="font-titleFont font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Que Vendemos */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-titleFont text-2xl md:text-3xl font-bold mb-3">Que Vendemos?</h2>
            <div className="w-16 h-1 bg-primeColor mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <span className="text-3xl mb-3 block">🧴</span>
              <h3 className="font-titleFont font-bold text-lg mb-2">Perfumes Originales</h3>
              <p className="text-sm text-gray-600">Invictus, Sauvage, 212 VIP, Good Girl, Versace y muchas mas marcas de lujo. Todos sellados y con garantia de autenticidad.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <span className="text-3xl mb-3 block">📱</span>
              <h3 className="font-titleFont font-bold text-lg mb-2">Smartphones & Tech</h3>
              <p className="text-sm text-gray-600">iPhone 15, Samsung Galaxy S24, AirPods Pro, Apple Watch y los mejores accesorios tech. Productos nuevos y sellados.</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <span className="text-3xl mb-3 block">⌚</span>
              <h3 className="font-titleFont font-bold text-lg mb-2">Relojes & Accesorios</h3>
              <p className="text-sm text-gray-600">Relojes inteligentes, accesorios de cuidado personal, fundas premium y todo lo que necesitas para complementar tu estilo.</p>
            </div>
          </div>
        </div>

        {/* Como Comprar */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-titleFont text-2xl md:text-3xl font-bold mb-3">Como Comprar?</h2>
            <div className="w-16 h-1 bg-primeColor mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Elige tu Producto", desc: "Navega nuestra tienda y agrega al carrito lo que te gusta" },
              { step: "2", title: "Completa tus Datos", desc: "Ingresa tu direccion de envio. Puedes comprar como invitado!" },
              { step: "3", title: "Realiza el Pago", desc: "Paga por Yape, Plin o transferencia y sube tu comprobante" },
              { step: "4", title: "Recibe tu Pedido", desc: "Te enviamos tu pedido con tracking para que lo sigas en todo momento" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-primeColor text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
                <h3 className="font-titleFont font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social / CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-titleFont text-2xl md:text-3xl font-bold mb-4">Siguenos en Redes Sociales</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">Mantente al dia con nuestras ofertas exclusivas, nuevos productos y promociones especiales.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="https://www.instagram.com/rume_import" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 duration-300">
              <FaInstagram className="text-xl" /> Instagram
            </a>
            <a href="https://www.tiktok.com/@rume_import_respa" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 duration-300">
              <SiTiktok className="text-xl" /> TikTok
            </a>
            <a href="https://wa.me/51" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 duration-300">
              <FaWhatsapp className="text-xl" /> WhatsApp
            </a>
          </div>
          <div className="mt-8">
            <Link to="/tienda">
              <button className="px-10 h-12 bg-primeColor text-white font-titleFont font-semibold rounded-lg hover:bg-black duration-300">
                Explorar Tienda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
