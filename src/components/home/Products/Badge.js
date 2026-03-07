import React from "react";

const Badge = ({ text }) => {
  return (
    <div className="bg-primeColor px-3 py-1.5 text-white flex justify-center items-center text-xs font-semibold rounded-lg shadow-sm">
      {text}
    </div>
  );
};

export default Badge;
