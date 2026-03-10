import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import { getProductById } from "../../services/productService";
import { MdPlayCircle } from "react-icons/md";

const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match ? match[1] : null;
};

const ProductDetails = () => {
  const location = useLocation();
  const { _id } = useParams();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      if (location.state?.item) {
        setProductInfo(location.state.item);
        setLoading(false);
      } else {
        try {
          const product = await getProductById(_id);
          if (product) setProductInfo(product);
        } catch (e) {
          console.error("Error loading product:", e);
        }
        setLoading(false);
      }
      setPrevLocation(location.pathname);
    };
    loadProduct();
    setSelectedImage(0);
    setShowVideo(false);
  }, [location, _id]);

  if (loading || !productInfo) {
    return (
      <div className="max-w-container mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primeColor rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-titleFont">Cargando producto...</p>
      </div>
    );
  }

  const images = productInfo.images || (productInfo.img ? [productInfo.img] : []);
  const youtubeId = getYoutubeId(productInfo.videoUrl);
  const hasVideo = Boolean(productInfo.videoUrl);

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
          <div className="h-full xl:col-span-2 flex flex-col gap-3">
            {/* Main image / video */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm aspect-square">
              {showVideo && youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title="Video del producto"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : showVideo && productInfo.videoUrl ? (
                <video src={productInfo.videoUrl} controls autoPlay className="w-full h-full object-contain bg-black" />
              ) : images[selectedImage] ? (
                <img
                  className="w-full h-full object-cover hover:scale-105 duration-500"
                  src={images[selectedImage]}
                  alt={productInfo.productName}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Sin imagen</div>
              )}
            </div>

            {/* Thumbnails */}
            {(images.length > 1 || hasVideo) && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setShowVideo(false); }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 duration-200 ${
                      !showVideo && selectedImage === i ? "border-primeColor" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {hasVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 duration-200 relative bg-gray-900 ${
                      showVideo ? "border-red-500" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {youtubeId ? (
                      <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt="Video" className="w-full h-full object-cover opacity-70" />
                    ) : null}
                    <MdPlayCircle className="absolute inset-0 m-auto text-white text-3xl" />
                  </button>
                )}
              </div>
            )}
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
