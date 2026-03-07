import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import { getProductsBySection } from "../../../services/productService";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductsBySection("newArrival");
        setProducts(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const settings = {
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, products.length || 1),
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1025, settings: { slidesToShow: Math.min(3, products.length || 1), slidesToScroll: 1, infinite: products.length > 3 } },
      { breakpoint: 769, settings: { slidesToShow: Math.min(2, products.length || 1), slidesToScroll: 2, infinite: products.length > 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, infinite: products.length > 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="w-full pb-16">
        <Heading heading="Nuevas Llegadas" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64 w-full mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="w-full pb-16">
      <Heading heading="Nuevas Llegadas" />
      <Slider {...settings}>
        {products.map((p) => (
          <div key={p._id} className="px-2">
            <Product
              _id={p._id}
              img={p.img}
              productName={p.productName}
              price={p.price}
              color={p.color}
              badge={p.badge}
              des={p.des}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewArrivals;
