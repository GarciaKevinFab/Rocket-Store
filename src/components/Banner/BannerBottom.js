import React from "react";
import { MdLocalShipping, MdVerified } from "react-icons/md";
import { CgRedo } from "react-icons/cg";

const BannerBottom = () => {
  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 px-4">
      <div className="max-w-container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-gray-50 duration-300 cursor-default">
          <span className="w-10 h-10 bg-primeColor/10 rounded-lg flex items-center justify-center">
            <MdVerified className="text-xl text-primeColor" />
          </span>
          <div>
            <p className="text-sm font-semibold text-primeColor font-titleFont">2 Años de Garantia</p>
            <p className="text-xs text-gray-400">Productos originales</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-gray-50 duration-300 cursor-default">
          <span className="w-10 h-10 bg-primeColor/10 rounded-lg flex items-center justify-center">
            <MdLocalShipping className="text-xl text-primeColor" />
          </span>
          <div>
            <p className="text-sm font-semibold text-primeColor font-titleFont">Envio a Todo el Peru</p>
            <p className="text-xs text-gray-400">Rapido y seguro</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-gray-50 duration-300 cursor-default">
          <span className="w-10 h-10 bg-primeColor/10 rounded-lg flex items-center justify-center">
            <CgRedo className="text-xl text-primeColor" />
          </span>
          <div>
            <p className="text-sm font-semibold text-primeColor font-titleFont">Devolucion 30 Dias</p>
            <p className="text-xs text-gray-400">Politica de devolucion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerBottom;
