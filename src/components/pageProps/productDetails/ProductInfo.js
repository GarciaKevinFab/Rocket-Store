import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl md:text-3xl font-bold font-titleFont text-primeColor">{productInfo.productName}</h2>
      <p className="text-2xl font-bold text-primeColor">S/.{productInfo.price}</p>
      <div className="flex items-center gap-1 text-yellow-400">
        {[1,2,3,4,5].map((i) => <FaStar key={i} className="text-sm" />)}
        <span className="text-xs text-gray-400 ml-2">Se el primero en opinar</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{productInfo.des}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">Color:</span>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{productInfo.color}</span>
      </div>
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
        <MdLocalShipping className="text-lg" />
        <span className="text-sm font-medium">Envio disponible a todo el Peru</span>
      </div>
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id || productInfo._id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
            })
          )
        }
        className="w-full py-3.5 bg-primeColor hover:bg-black duration-300 text-white text-base font-semibold font-titleFont rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <FaShoppingCart />
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductInfo;
