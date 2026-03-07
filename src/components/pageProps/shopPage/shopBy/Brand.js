import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Brand = ({ brands = [], activeBrand = "", onSelect = () => {} }) => {
  const [showBrands, setShowBrands] = useState(true);

  const handleClick = (brand) => {
    onSelect(activeBrand === brand ? "" : brand);
  };

  return (
    <div>
      <div onClick={() => setShowBrands(!showBrands)} className="cursor-pointer">
        <NavTitle title="Marcas" icons={true} />
      </div>
      {showBrands && (
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <ul className="flex flex-col gap-1 text-sm text-gray-500">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <li
                  key={brand}
                  onClick={() => handleClick(brand)}
                  className={`px-3 py-2 rounded-lg cursor-pointer duration-200 ${
                    activeBrand === brand
                      ? "bg-primeColor text-white font-medium"
                      : "hover:bg-gray-50 hover:text-primeColor"
                  }`}
                >
                  {brand}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400 text-xs">No hay marcas disponibles</li>
            )}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Brand;
