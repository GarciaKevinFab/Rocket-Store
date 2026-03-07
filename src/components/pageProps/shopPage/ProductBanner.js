import React, { useEffect, useState } from "react";
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";
import { GoTriangleDown } from "react-icons/go";

const ProductBanner = ({ itemsPerPageFromBanner }) => {
  const [girdViewActive, setGridViewActive] = useState(true);
  const [listViewActive, setListViewActive] = useState(false);
  useEffect(() => {
    const gridView = document.querySelector(".gridView");
    const listView = document.querySelector(".listView");

    gridView.addEventListener("click", () => {
      setListViewActive(false);
      setGridViewActive(true);
    });
    listView.addEventListener("click", () => {
      setGridViewActive(false);
      setListViewActive(true);
    });
  }, [girdViewActive, listViewActive]);

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <span
          className={`${
            girdViewActive
              ? "bg-primeColor text-white shadow-md"
              : "border border-gray-200 text-gray-400 hover:border-primeColor hover:text-primeColor"
          } w-9 h-9 text-lg flex items-center justify-center cursor-pointer gridView rounded-lg duration-300`}
        >
          <BsGridFill />
        </span>
        <span
          className={`${
            listViewActive
              ? "bg-primeColor text-white shadow-md"
              : "border border-gray-200 text-gray-400 hover:border-primeColor hover:text-primeColor"
          } w-9 h-9 text-base flex items-center justify-center cursor-pointer listView rounded-lg duration-300`}
        >
          <ImList />
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-4 mt-4 md:mt-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 relative">
          <label className="block font-medium">Ordenar:</label>
          <select
            className="w-32 md:w-44 border border-gray-200 py-2 px-3 cursor-pointer text-primeColor text-sm rounded-lg appearance-none focus:outline-none focus:border-primeColor duration-200 bg-gray-50"
          >
            <option value="Best Sellers">Mas Vendidos</option>
            <option value="New Arrival">Nuevas Llegadas</option>
            <option value="Featured">Destacado</option>
            <option value="Final Offer">Oferta Final</option>
          </select>
          <span className="absolute text-xs right-2.5 top-3 text-gray-400 pointer-events-none">
            <GoTriangleDown />
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 relative">
          <label className="block font-medium">Mostrar:</label>
          <select
            onChange={(e) => itemsPerPageFromBanner(+e.target.value)}
            className="w-16 md:w-20 border border-gray-200 py-2 px-3 cursor-pointer text-primeColor text-sm rounded-lg appearance-none focus:outline-none focus:border-primeColor duration-200 bg-gray-50"
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="36">36</option>
            <option value="48">48</option>
          </select>
          <span className="absolute text-xs right-2 top-3 text-gray-400 pointer-events-none">
            <GoTriangleDown />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
