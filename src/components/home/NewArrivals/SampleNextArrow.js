import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="w-10 h-10 md:w-12 md:h-12 rounded-xl text-white bg-primeColor/70 hover:bg-primeColor shadow-lg duration-300 cursor-pointer flex justify-center items-center z-10 absolute top-[40%] right-1 md:right-2"
      onClick={onClick}
    >
      <span className="text-base md:text-lg">
        <FaLongArrowAltRight />
      </span>
    </div>
  );
};

export default SampleNextArrow;
