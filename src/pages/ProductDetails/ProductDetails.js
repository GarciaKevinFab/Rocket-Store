import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import { paginationItems } from "../../constants";

const ProductDetails = () => {
  const location = useLocation();
  const { _id } = useParams();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (location.state?.item) {
      setProductInfo(location.state.item);
    } else {
      const found = paginationItems.find(
        (item) => String(item._id) === String(_id)
      );
      if (found) {
        setProductInfo(found);
      }
    }
    setPrevLocation(location.pathname);
  }, [location, _id]);

  if (!productInfo) {
    return (
      <div className="max-w-container mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primeColor rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-titleFont">Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto border-b border-gray-100">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-50/50 rounded-2xl p-4 md:p-6">
          <div className="h-full hidden xl:block">
            <ProductsOnSale />
          </div>
          <div className="h-full xl:col-span-2 rounded-xl overflow-hidden bg-white shadow-sm">
            <img
              className="w-full h-full object-cover hover:scale-105 duration-500"
              src={productInfo.img}
              alt={productInfo.productName}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-10 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
