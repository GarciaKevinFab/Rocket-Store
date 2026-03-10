import React from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productItem = props;
  const handleProductDetails = () => {
    navigate(`/product/${props._id}`, {
      state: { item: productItem },
    });
  };
  return (
    <div className="w-full relative group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg duration-300">
      <div className="w-full aspect-square relative overflow-hidden">
        <div onClick={handleProductDetails} className="cursor-pointer w-full h-full">
          <Image className="w-full h-full object-cover group-hover:scale-105 duration-500" imgSrc={props.img} />
        </div>
        <div className="absolute top-3 left-3">
          {props.badge && <Badge text="Nuevo" />}
        </div>
        <div className="w-full h-auto absolute bg-white/95 backdrop-blur-sm -bottom-[130px] group-hover:bottom-0 duration-500">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-1 font-titleFont px-3 py-3">
            <li
              onClick={() =>
                dispatch(
                  addToCart({
                    _id: props._id,
                    name: props.productName,
                    quantity: 1,
                    image: props.img,
                    badge: props.badge,
                    price: props.price,
                    colors: props.color,
                  })
                )
              }
              className="text-gray-600 hover:text-white hover:bg-primeColor text-sm font-normal flex items-center justify-end gap-2 hover:cursor-pointer px-3 py-2 rounded-lg duration-300 w-full"
            >
              Agregar al carrito
              <FaShoppingCart />
            </li>
            <li
              onClick={handleProductDetails}
              className="text-gray-600 hover:text-white hover:bg-primeColor text-sm font-normal flex items-center justify-end gap-2 hover:cursor-pointer px-3 py-2 rounded-lg duration-300 w-full"
            >
              Ver detalles
              <MdOutlineLabelImportant className="text-lg" />
            </li>
            <li className="text-gray-600 hover:text-white hover:bg-primeColor text-sm font-normal flex items-center justify-end gap-2 hover:cursor-pointer px-3 py-2 rounded-lg duration-300 w-full">
              Agregar a favoritos
              <BsSuitHeartFill />
            </li>
          </ul>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-sm font-bold text-primeColor truncate pr-2">
            {props.productName}
          </h2>
          <p className="text-primeColor font-bold text-sm whitespace-nowrap">S/.{Number(props.price).toFixed(2)}</p>
        </div>
        {props.brand && (
          <p className="text-gray-400 text-xs">{props.brand}</p>
        )}
      </div>
    </div>
  );
};

export default Product;
