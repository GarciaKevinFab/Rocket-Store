import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaClock, FaEnvelope, FaPhone } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import toast from "react-hot-toast";

const Contact = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    if (location.state?.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);

  const [clientName, setclientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [messages, setMessages] = useState("");

  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errMessages, setErrMessages] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const EmailValidation = (email) => {
    return String(email).toLowerCase().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handlePost = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!clientName) { setErrClientName("Ingrese su nombre"); hasError = true; }
    if (!email) { setErrEmail("Ingrese su email"); hasError = true; }
    else if (!EmailValidation(email)) { setErrEmail("Ingrese un email valido"); hasError = true; }
    if (!messages) { setErrMessages("Ingrese su mensaje"); hasError = true; }
    if (hasError) return;

    setSuccessMsg(`Gracias ${clientName}! Tu mensaje ha sido recibido. Te responderemos pronto a ${email}.`);
    toast.success("Mensaje enviado!");
  };

  const contactInfo = [
    { icon: <FaWhatsapp className="text-2xl text-green-500" />, title: "WhatsApp", value: "Escribenos al WhatsApp", link: "https://wa.me/51", linkText: "Enviar mensaje" },
    { icon: <FaInstagram className="text-2xl text-pink-500" />, title: "Instagram", value: "@rume_import", link: "https://www.instagram.com/rume_import", linkText: "Seguir" },
    { icon: <SiTiktok className="text-2xl" />, title: "TikTok", value: "@rume_import_respa", link: "https://www.tiktok.com/@rume_import_respa", linkText: "Seguir" },
    { icon: <FaEnvelope className="text-2xl text-blue-500" />, title: "Email", value: "contacto@rumeimport.com", link: "mailto:contacto@rumeimport.com", linkText: "Enviar correo" },
  ];

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Contacto" prevLocation={prevLocation} />

      <div className="pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-titleFont text-3xl md:text-4xl font-bold mb-4">Contactanos</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Estamos aqui para ayudarte. Escribenos por cualquier consulta, pedido especial o si necesitas asesoria personalizada.</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info) => (
            <a
              key={info.title}
              href={info.link}
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                {info.icon}
                <h3 className="font-titleFont font-bold">{info.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">{info.value}</p>
              <span className="text-sm text-primeColor font-medium group-hover:text-black duration-300">{info.linkText} &rarr;</span>
            </a>
          ))}
        </div>

        {/* Info + Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info Side */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-primeColor to-gray-800 rounded-xl p-8 text-white">
              <h2 className="font-titleFont text-2xl font-bold mb-6">Informacion de Contacto</h2>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-xl mt-1 text-yellow-300" />
                  <div>
                    <p className="font-semibold">Ubicacion</p>
                    <p className="text-sm text-gray-300">Lima, Peru</p>
                    <p className="text-sm text-gray-300">Envios a nivel nacional</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaClock className="text-xl mt-1 text-yellow-300" />
                  <div>
                    <p className="font-semibold">Horario de Atencion</p>
                    <p className="text-sm text-gray-300">Lunes a Sabado: 9:00 AM - 8:00 PM</p>
                    <p className="text-sm text-gray-300">Domingos: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaPhone className="text-xl mt-1 text-yellow-300" />
                  <div>
                    <p className="font-semibold">Tiempo de Respuesta</p>
                    <p className="text-sm text-gray-300">WhatsApp: Menos de 1 hora</p>
                    <p className="text-sm text-gray-300">Instagram DM: Menos de 2 horas</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-gray-300 mb-3">Siguenos en redes:</p>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/rume_import" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 duration-300">
                    <FaInstagram />
                  </a>
                  <a href="https://www.tiktok.com/@rume_import_respa" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 duration-300">
                    <SiTiktok />
                  </a>
                  <a href="https://wa.me/51" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 duration-300">
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ mini */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-titleFont font-bold text-lg mb-4">Preguntas Frecuentes</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-semibold text-sm">Cuanto demora el envio?</p>
                  <p className="text-sm text-gray-500">Lima: 1-2 dias habiles. Provincias: 3-5 dias habiles.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Los productos son originales?</p>
                  <p className="text-sm text-gray-500">Si, todos nuestros productos son 100% originales con garantia de autenticidad.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Que metodos de pago aceptan?</p>
                  <p className="text-sm text-gray-500">Aceptamos Yape, Plin y transferencia bancaria.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Puedo comprar sin crear cuenta?</p>
                  <p className="text-sm text-gray-500">Si! Puedes comprar como invitado y rastrear tu pedido con tu email.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="font-titleFont text-2xl font-bold mb-2">Enviar Mensaje</h2>
              <p className="text-sm text-gray-500 mb-6">Completa el formulario y te responderemos lo antes posible.</p>

              {successMsg ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-500 text-5xl mb-4">&#10003;</div>
                  <p className="font-medium text-green-700 text-lg mb-2">Mensaje Enviado!</p>
                  <p className="text-sm text-green-600">{successMsg}</p>
                  <button
                    onClick={() => { setSuccessMsg(""); setclientName(""); setEmail(""); setPhone(""); setSubject(""); setMessages(""); }}
                    className="mt-4 text-sm text-primeColor font-medium hover:text-black duration-300"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePost} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-titleFont text-sm font-semibold text-gray-600 block mb-1">Nombre completo *</label>
                      <input
                        onChange={(e) => { setclientName(e.target.value); setErrClientName(""); }}
                        value={clientName}
                        className="w-full h-11 px-4 border border-gray-300 rounded-lg outline-none focus:border-primeColor duration-300 text-sm"
                        type="text"
                        placeholder="Tu nombre"
                      />
                      {errClientName && <p className="text-red-500 text-xs mt-1">{errClientName}</p>}
                    </div>
                    <div>
                      <label className="font-titleFont text-sm font-semibold text-gray-600 block mb-1">Correo electronico *</label>
                      <input
                        onChange={(e) => { setEmail(e.target.value); setErrEmail(""); }}
                        value={email}
                        className="w-full h-11 px-4 border border-gray-300 rounded-lg outline-none focus:border-primeColor duration-300 text-sm"
                        type="email"
                        placeholder="tu@correo.com"
                      />
                      {errEmail && <p className="text-red-500 text-xs mt-1">{errEmail}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-titleFont text-sm font-semibold text-gray-600 block mb-1">Telefono (opcional)</label>
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                        className="w-full h-11 px-4 border border-gray-300 rounded-lg outline-none focus:border-primeColor duration-300 text-sm"
                        type="text"
                        placeholder="987 654 321"
                      />
                    </div>
                    <div>
                      <label className="font-titleFont text-sm font-semibold text-gray-600 block mb-1">Asunto (opcional)</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-11 px-4 border border-gray-300 rounded-lg outline-none focus:border-primeColor duration-300 text-sm bg-white"
                      >
                        <option value="">Seleccionar</option>
                        <option value="consulta">Consulta sobre un producto</option>
                        <option value="pedido">Consulta sobre mi pedido</option>
                        <option value="devolucion">Devolucion o cambio</option>
                        <option value="mayoreo">Compra al por mayor</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-titleFont text-sm font-semibold text-gray-600 block mb-1">Mensaje *</label>
                    <textarea
                      onChange={(e) => { setMessages(e.target.value); setErrMessages(""); }}
                      value={messages}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primeColor duration-300 text-sm resize-none"
                      placeholder="Escribe tu mensaje aqui... Se lo mas detallado posible para poder ayudarte mejor."
                    />
                    {errMessages && <p className="text-red-500 text-xs mt-1">{errMessages}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto sm:px-12 h-12 bg-primeColor text-white font-titleFont font-semibold rounded-lg hover:bg-black duration-300"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
