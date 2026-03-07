import React from "react";
import { SplOfferData } from "../../../constants";

const ProductsOnSale = () => {
  return (
    <div>
      <h3 className="font-titleFont text-base font-bold mb-4 text-primeColor">
        En oferta
      </h3>
      <div className="w-10 h-0.5 bg-primeColor/30 rounded-full mb-4"></div>
      <div className="flex flex-col gap-3">
        {SplOfferData.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img className="w-full h-full object-cover" src={item.img} alt={item.productName} />
            </div>
            <div className="flex flex-col gap-1 font-titleFont min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{item.productName}</p>
              <p className="text-sm font-bold text-primeColor">S/.{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsOnSale;
