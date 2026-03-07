import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const colors = [
  { name: "Negro", hex: "#000000" },
  { name: "Blanco", hex: "#ffffff" },
  { name: "Dorado", hex: "#d4a574" },
  { name: "Azul", hex: "#3b82f6" },
  { name: "Rojo", hex: "#dc2626" },
  { name: "Verde", hex: "#22c55e" },
  { name: "Plomo", hex: "#a3a3a3" },
  { name: "Amarillo", hex: "#f59e0b" },
];

const Color = ({ activeColor = "", onSelect = () => {} }) => {
  const [showColor, setShowColor] = useState(true);

  const handleClick = (colorName) => {
    onSelect(activeColor === colorName ? "" : colorName);
  };

  return (
    <div className="cursor-pointer">
      <div onClick={() => setShowColor(!showColor)}>
        <NavTitle title="Color" icons={true} />
      </div>
      {showColor && (
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <ul className="flex flex-col gap-1 text-sm text-gray-500">
            {colors.map((color) => (
              <li
                key={color.name}
                onClick={() => handleClick(color.name)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer duration-200 ${
                  activeColor === color.name
                    ? "bg-primeColor text-white font-medium"
                    : "hover:bg-gray-50 hover:text-primeColor"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border-2 shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: activeColor === color.name ? "#fff" : color.hex === "#ffffff" ? "#d1d5db" : color.hex,
                  }}
                />
                {color.name}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Color;
