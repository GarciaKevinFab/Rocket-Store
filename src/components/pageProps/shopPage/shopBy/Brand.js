import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Brand = () => {
  const [showBrands, setShowBrands] = useState(true);
  const brands = [
    { _id: 9006, title: "Apple" },
    { _id: 9007, title: "Samsung" },
    { _id: 9008, title: "Carolina Herrera" },
    { _id: 9009, title: "Dior" },
    { _id: 9010, title: "Paco Rabanne" },
    { _id: 9011, title: "Versace" },
  ];

  return (
    <div>
      <div
        onClick={() => setShowBrands(!showBrands)}
        className="cursor-pointer"
      >
        <NavTitle title="Marca" icons={true} />
      </div>
      {showBrands && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-2 text-sm text-gray-500">
            {brands.map((item) => (
              <li
                key={item._id}
                className="border-b border-gray-100 pb-2 flex items-center gap-2 hover:text-primeColor duration-200 cursor-pointer rounded-lg hover:bg-gray-50 px-2 py-1"
              >
                {item.title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Brand;
