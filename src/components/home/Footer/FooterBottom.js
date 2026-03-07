import React from "react";

const FooterBottom = () => {
  return (
    <div className="w-full bg-[#F5F5F3]">
      <div className="max-w-container mx-auto border-t border-gray-200 py-8">
        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} <span className="font-medium text-gray-500">RUME IMPORT</span> | Todos los Derechos Reservados | Powered by{" "}
          <a href="https://github.com/GarciaKevinFab" target="_blank" rel="noreferrer" className="font-medium hover:text-primeColor duration-200">
            K3V1N
          </a>
          {" & "}
          <a href="https://github.com/jhonatanFFritz" target="_blank" rel="noreferrer" className="font-medium hover:text-primeColor duration-200">
            Jhonatan
          </a>
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;
