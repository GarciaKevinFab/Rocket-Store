import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";

const ItemCard = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full grid grid-cols-5 border-b border-gray-100 py-4 px-4 hover:bg-gray-50 duration-200">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4">
        <button
          onClick={() => dispatch(deleteItem(item._id))}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 duration-300"
        >
          <FaTrashAlt className="text-xs" />
        </button>
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
          <img className="w-full h-full object-cover" src={item.image} alt="productImage" />
        </div>
        <h1 className="font-titleFont font-semibold text-sm md:text-base">{item.name}</h1>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-sm md:text-base font-semibold text-gray-600">
          S/.{Number(item.price).toFixed(2)}
        </div>
        <div className="w-1/3 flex items-center gap-0">
          <button
            onClick={() => dispatch(decreaseQuantity({ _id: item._id }))}
            className="w-8 h-8 bg-gray-100 text-lg flex items-center justify-center hover:bg-primeColor hover:text-white cursor-pointer duration-300 rounded-l-lg border border-gray-200"
          >
            -
          </button>
          <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-200 text-sm font-semibold bg-white">
            {item.quantity}
          </span>
          <button
            onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
            className="w-8 h-8 bg-gray-100 text-lg flex items-center justify-center hover:bg-primeColor hover:text-white cursor-pointer duration-300 rounded-r-lg border border-gray-200"
          >
            +
          </button>
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-base text-primeColor">
          <p>S/.{(item.quantity * item.price).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
