import React from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="w-10 h-10 md:w-12 md:h-12 rounded-xl text-white bg-primeColor/70 hover:bg-primeColor shadow-lg duration-300 cursor-pointer flex justify-center items-center absolute z-10 top-[40%] left-1 md:left-2"
      onClick={onClick}
    >
      <span className="text-base md:text-lg">
        <FaLongArrowAltLeft />
      </span>
    </div>
  );
};

export default SamplePrevArrow;
