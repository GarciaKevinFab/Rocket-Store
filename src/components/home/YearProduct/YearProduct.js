import React from "react";
import { Link } from "react-router-dom";
import { productOfTheYear } from "../../../assets/images";
import Image from "../../designLayouts/Image";

const YearProduct = () => {
  return (
    <div className="w-full mb-20 rounded-2xl overflow-hidden shadow-lg">
      <Link to="/tienda">
        <div className="w-full h-80 bg-gradient-to-r from-gray-100 to-gray-50 relative font-titleFont group">
          <Image
            className="w-full h-full object-cover hidden md:inline-block group-hover:scale-105 duration-700"
            imgSrc={productOfTheYear}
          />
          <div className="w-full md:w-2/3 xl:w-1/2 h-80 absolute px-6 md:px-8 top-0 right-0 flex flex-col items-start gap-4 justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primeColor/60 bg-white/80 px-3 py-1 rounded-full">
              Destacado
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-primeColor leading-tight">
              Producto del Año
            </h1>
            <p className="text-sm md:text-base font-normal text-gray-600 max-w-[500px] leading-relaxed">
              Descubre nuestro producto mas destacado. Calidad premium, precio inmejorable. No te lo pierdas!
            </p>
            <button className="bg-primeColor text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-black duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Comprar ahora
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default YearProduct;
