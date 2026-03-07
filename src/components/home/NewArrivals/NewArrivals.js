import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  newArrOne,
  newArrTwo,
  newArrThree,
  newArrFour,
} from "../../../assets/images/index";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="w-full pb-16">
      <Heading heading="Nuevas Llegadas" />
      <Slider {...settings}>
        <div className="px-2">
          <Product
            _id="1009"
            img={newArrOne}
            productName="Apple Watch Series 9 GPS"
            price="1899.00"
            color="Negro"
            badge={true}
            des="Chip S9, pantalla Retina siempre activa, sensor de oxigeno en sangre y ECG. Resistente al agua hasta 50 metros."
          />
        </div>
        <div className="px-2">
          <Product
            _id="1010"
            img={newArrTwo}
            productName="Samsung Galaxy S24 Ultra"
            price="5199.00"
            color="Negro"
            badge={true}
            des="Pantalla Dynamic AMOLED 2X de 6.8 pulgadas, camara de 200MP, S Pen integrado y procesador Snapdragon 8 Gen 3."
          />
        </div>
        <div className="px-2">
          <Product
            _id="1011"
            img={newArrThree}
            productName="Set de Cuidado Facial Completo"
            price="120.00"
            color="Variado"
            badge={true}
            des="Kit completo con limpiador facial, tonico, serum de vitamina C y crema hidratante. Rutina de cuidado para piel radiante."
          />
        </div>
        <div className="px-2">
          <Product
            _id="1012"
            img={newArrFour}
            productName="iPhone 15 Pro Max 256GB"
            price="5999.00"
            color="Titanio Natural"
            badge={false}
            des="El iPhone mas potente con chip A17 Pro, camara de 48MP, pantalla Super Retina XDR de 6.7 pulgadas y cuerpo de titanio."
          />
        </div>
        <div className="px-2">
          <Product
            _id="1014"
            img={newArrTwo}
            productName="Samsung Galaxy A55 5G"
            price="1599.00"
            color="Azul"
            badge={true}
            des="Pantalla Super AMOLED de 6.6 pulgadas, triple camara de 50MP, bateria de 5000mAh y conectividad 5G."
          />
        </div>
      </Slider>
    </div>
  );
};

export default NewArrivals;
