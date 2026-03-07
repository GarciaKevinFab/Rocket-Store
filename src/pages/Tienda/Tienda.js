import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Tienda = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Productos" />
      <div className="w-full h-full flex pb-20 gap-8">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <ShopSideNav />
          </div>
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-8">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
          <Pagination itemsPerPage={itemsPerPage} />
        </div>
      </div>
    </div>
  );
};

export default Tienda;
