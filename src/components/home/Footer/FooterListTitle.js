import React from "react";

const FooterListTitle = ({ title }) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold font-titleFont uppercase tracking-wide text-primeColor">{title}</h3>
      <div className="w-10 h-0.5 bg-primeColor/30 rounded-full mt-2"></div>
    </div>
  );
};

export default FooterListTitle;
