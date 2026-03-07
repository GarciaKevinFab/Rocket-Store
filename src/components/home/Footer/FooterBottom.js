import React from "react";

const FooterBottom = () => {
  return (
    <div className="w-full bg-[#F5F5F3]">
      <div className="max-w-container mx-auto border-t border-gray-200 py-8">
        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-500">RUME IMPORT</span> | Todos los Derechos Reservados | Powered by{" "}
          <span className="font-medium text-gray-500 hover:text-primeColor duration-200">
            STAR INSIGHTS IT
          </span>
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;
