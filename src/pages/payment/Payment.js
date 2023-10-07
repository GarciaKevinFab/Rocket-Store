import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Payment = () => {
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Pasarela de pago" />
      <div className="pb-10">
        <p>Próximamente disponible.</p>
        <Link to="/">
          <button className="w-52 h-10 bg-primeColor text-white text-lg mt-4 hover:bg-black duration-300">
            Seguir explorando
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Payment;
