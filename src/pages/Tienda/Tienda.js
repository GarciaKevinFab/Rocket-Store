import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import { FaFilter } from "react-icons/fa";

const Tienda = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Productos" />

      {/* Mobile filter toggle */}
      <div className="mdl:hidden mb-4">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-primeColor hover:text-primeColor duration-200 shadow-sm"
        >
          <FaFilter className="text-xs" />
          {showMobileFilter ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
      </div>

      {/* Mobile filters */}
      {showMobileFilter && (
        <div className="mdl:hidden mb-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <ShopSideNav />
        </div>
      )}

      <div className="w-full h-full flex pb-20 gap-8">
        {/* Sidebar */}
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <ShopSideNav />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-6">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
          <Pagination itemsPerPage={itemsPerPage} />
        </div>
      </div>
    </div>
  );
};

export default Tienda;
