import React from "react";

const Heading = ({ heading }) => {
  return (
    <div className="pb-8">
      <h2 className="text-2xl md:text-3xl font-bold font-titleFont text-primeColor">
        {heading}
      </h2>
      <div className="w-16 h-1 bg-primeColor rounded-full mt-2"></div>
    </div>
  );
};

export default Heading;
