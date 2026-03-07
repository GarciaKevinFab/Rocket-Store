import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Nosotros = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    if (location.state?.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Sobre Nosotros" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">ROCKET</span>{" "}
          es tu tienda online de confianza en Peru. Perfumes originales, smartphones de ultima generacion, accesorios tech y mucho mas. Ofrecemos productos autenticos con envio a todo el pais y los mejores metodos de pago: Yape, Plin y transferencia bancaria.
        </h1>
        <Link to="/tienda">
          <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
            Continuar comprando
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Nosotros;
