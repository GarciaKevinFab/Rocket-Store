import React from "react";
import { BiCaretDown } from "react-icons/bi";

const NavTitle = ({ title, icons }) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <h3 className="font-bold text-sm lg:text-base text-primeColor uppercase tracking-wide">{title}</h3>
      {icons && <BiCaretDown className="text-gray-400" />}
    </div>
  );
};

export default NavTitle;
