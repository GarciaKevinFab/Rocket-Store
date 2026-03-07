import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Color = () => {
  const [showColors, setShowColors] = useState(true);
  const colors = [
    { _id: 9001, title: "Verde", base: "#22c55e" },
    { _id: 9002, title: "Plomo", base: "#a3a3a3" },
    { _id: 9003, title: "Rojo", base: "#dc2626" },
    { _id: 9004, title: "Amarillo", base: "#f59e0b" },
    { _id: 9005, title: "Azul", base: "#3b82f6" },
  ];

  return (
    <div>
      <div
        onClick={() => setShowColors(!showColors)}
        className="cursor-pointer"
      >
        <NavTitle title="Color" icons={true} />
      </div>
      {showColors && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-2 text-sm text-gray-500">
            {colors.map((item) => (
              <li
                key={item._id}
                className="border-b border-gray-100 pb-2 flex items-center gap-2 hover:text-primeColor duration-200 cursor-pointer rounded-lg hover:bg-gray-50 px-2 py-1"
              >
                <span
                  style={{ background: item.base }}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                ></span>
                {item.title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Color;
