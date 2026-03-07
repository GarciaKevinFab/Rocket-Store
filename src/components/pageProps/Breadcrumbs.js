import React, { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";

const Breadcrumbs = ({ prevLocation, title }) => {
  const location = useLocation();
  const [locationPath, setLocationPath] = useState("");
  useEffect(() => {
    setLocationPath(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <div className="w-full py-8 xl:py-10 flex flex-col gap-2">
      <h1 className="text-3xl md:text-4xl text-primeColor font-titleFont font-bold">
        {title}
      </h1>
      <p className="text-sm font-normal text-gray-400 capitalize flex items-center gap-1">
        <span>{prevLocation === "" ? "Inicio" : prevLocation}</span>
        <HiOutlineChevronRight className="text-xs" />
        <span className="capitalize font-medium text-primeColor">
          {locationPath}
        </span>
      </p>
    </div>
  );
};

export default Breadcrumbs;
