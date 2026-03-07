import React, { useState } from "react";
import NavTitle from "./NavTitle";
import { motion } from "framer-motion";

const priceRanges = [
  { label: "S/. 0.00 - 49.99", min: 0, max: 49.99 },
  { label: "S/. 50.00 - 99.99", min: 50, max: 99.99 },
  { label: "S/. 100.00 - 199.99", min: 100, max: 199.99 },
  { label: "S/. 200.00 - 399.99", min: 200, max: 399.99 },
  { label: "S/. 400.00 - 999.99", min: 400, max: 999.99 },
  { label: "S/. 1,000.00+", min: 1000, max: 99999 },
];

const Price = ({ activePrice = "", onSelect = () => {} }) => {
  const [showPrice, setShowPrice] = useState(true);

  const handleClick = (min, max) => {
    const key = `${min}-${max}`;
    if (activePrice === key) {
      onSelect(null, null);
    } else {
      onSelect(min, max);
    }
  };

  return (
    <div className="cursor-pointer">
      <div onClick={() => setShowPrice(!showPrice)}>
        <NavTitle title="Precio" icons={true} />
      </div>
      {showPrice && (
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <ul className="flex flex-col gap-1 text-sm text-gray-500">
            {priceRanges.map((range) => {
              const key = `${range.min}-${range.max}`;
              return (
                <li
                  key={key}
                  onClick={() => handleClick(range.min, range.max)}
                  className={`px-3 py-2 rounded-lg cursor-pointer duration-200 ${
                    activePrice === key
                      ? "bg-primeColor text-white font-medium"
                      : "hover:bg-gray-50 hover:text-primeColor"
                  }`}
                >
                  {range.label}
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Price;
