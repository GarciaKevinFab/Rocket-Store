import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { Link } from "react-router-dom";
import FooterListTitle from "./FooterListTitle";

const Footer = () => {
  const [emailInfo, setEmailInfo] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const emailValidation = () => {
    return String(emailInfo)
      .toLocaleLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleSubscription = () => {
    if (emailInfo === "") {
      setErrMsg("Por favor, proporciona un correo electronico!");
    } else if (!emailValidation(emailInfo)) {
      setErrMsg("Introduce un correo electronico valido!");
    } else {
      setSubscription(true);
      setErrMsg("");
      setEmailInfo("");
    }
  };
  return (
    <div className="w-full bg-[#F5F5F3] py-16">
      <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 px-4 gap-10">
        <div className="col-span-2">
          <FooterListTitle title="RUME IMPORT" />
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 leading-relaxed w-full xl:w-[80%]">
              Tu tienda online de perfumes originales, smartphones y accesorios tech en Peru. Envios a todo el pais con Yape, Plin y transferencia bancaria.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/rume_import" target="_blank" rel="noreferrer" className="w-9 h-9 bg-primeColor text-white rounded-lg flex items-center justify-center hover:bg-black duration-300 text-lg">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@rume_import_respa" target="_blank" rel="noreferrer" className="w-9 h-9 bg-primeColor text-white rounded-lg flex items-center justify-center hover:bg-black duration-300 text-lg">
                <SiTiktok />
              </a>
            </div>
          </div>
        </div>
        <div>
          <FooterListTitle title="Tienda" />
          <ul className="flex flex-col gap-2">
            {["Perfumes", "Smartphones", "Accesorios Tech", "Relojes", "Cuidado Personal"].map((item) => (
              <Link to="/tienda" key={item}>
                <li className="font-titleFont text-sm text-gray-500 hover:text-primeColor hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {item}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div>
          <FooterListTitle title="Tu cuenta" />
          <ul className="flex flex-col gap-2">
            <Link to="/perfil"><li className="font-titleFont text-sm text-gray-500 hover:text-primeColor hover:translate-x-1 transition-all duration-200 cursor-pointer">Perfil</li></Link>
            <Link to="/mis-pedidos"><li className="font-titleFont text-sm text-gray-500 hover:text-primeColor hover:translate-x-1 transition-all duration-200 cursor-pointer">Pedidos</li></Link>
            <Link to="/rastrear-pedido"><li className="font-titleFont text-sm text-gray-500 hover:text-primeColor hover:translate-x-1 transition-all duration-200 cursor-pointer">Rastrear Pedido</li></Link>
            <Link to="/nosotros"><li className="font-titleFont text-sm text-gray-500 hover:text-primeColor hover:translate-x-1 transition-all duration-200 cursor-pointer">Sobre Nosotros</li></Link>
            <Link to="/contacto"><li className="font-titleFont text-sm text-gray-500 hover:text-primeColor hover:translate-x-1 transition-all duration-200 cursor-pointer">Contacto</li></Link>
          </ul>
        </div>
        <div className="col-span-2 flex flex-col items-center w-full px-0 xl:px-4">
          <FooterListTitle title="Suscribete a nuestro boletin" />
          <div className="w-full">
            <p className="text-center text-sm text-gray-500 mb-4">
              Mantente actualizado con las ultimas ofertas y productos. Unite a la comunidad RUME IMPORT!
            </p>
            {subscription ? (
              <motion.p
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full text-center text-sm font-titleFont font-semibold text-green-600"
              >
                Suscripcion exitosa!
              </motion.p>
            ) : (
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col flex-1">
                  <input
                    onChange={(e) => setEmailInfo(e.target.value)}
                    value={emailInfo}
                    className="w-full h-11 border border-gray-300 bg-white px-4 text-sm rounded-lg outline-none focus:border-primeColor duration-200"
                    type="text"
                    placeholder="Correo electronico..."
                  />
                  {errMsg && (
                    <p className="text-red-500 text-xs mt-1.5 text-center">
                      {errMsg}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSubscription}
                  className="h-11 px-6 bg-primeColor text-white text-sm font-medium rounded-lg hover:bg-black duration-300 whitespace-nowrap"
                >
                  Suscribir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
