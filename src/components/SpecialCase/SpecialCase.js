import React from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";

const SpecialCase = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const { currentUser } = useAuth();
  return (
    <div className="fixed top-52 right-3 z-20 hidden md:flex flex-col gap-2">
      <Link to={currentUser ? "/perfil" : "/signin"}>
        <div className="bg-white w-14 h-14 rounded-xl flex flex-col gap-0.5 text-gray-500 justify-center items-center shadow-lg border border-gray-100 overflow-x-hidden group cursor-pointer hover:bg-primeColor hover:text-white hover:border-primeColor duration-300">
          <MdSwitchAccount className="text-xl" />
          <p className="text-[10px] font-semibold font-titleFont">Perfil</p>
        </div>
      </Link>
      <Link to="/cart">
        <div className="bg-white w-14 h-14 rounded-xl flex flex-col gap-0.5 text-gray-500 justify-center items-center shadow-lg border border-gray-100 overflow-x-hidden group cursor-pointer hover:bg-primeColor hover:text-white hover:border-primeColor duration-300 relative">
          <RiShoppingCart2Fill className="text-xl" />
          <p className="text-[10px] font-semibold font-titleFont">Carrito</p>
          {products.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
              {products.length}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SpecialCase;
