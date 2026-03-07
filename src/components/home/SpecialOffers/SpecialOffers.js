import React from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  spfOne,
  spfTwo,
  spfThree,
  spfFour,
} from "../../../assets/images/index";

const SpecialOffers = () => {
  return (
    <div className="w-full pb-20">
      <Heading heading="Oferta Especial" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        <Product
          _id="1001"
          img={spfOne}
          productName="Perfume Invictus Paco Rabanne"
          price="189.00"
          color="Dorado"
          badge={true}
          des="Fragancia masculina iconica con notas de pomelo, madera de guayaco y ambar gris. Ideal para el hombre moderno."
        />
        <Product
          _id="1002"
          img={spfTwo}
          productName="iPhone 15 128GB"
          price="4299.00"
          color="Negro"
          badge={true}
          des="Chip A16 Bionic, pantalla Super Retina XDR de 6.1 pulgadas, Dynamic Island y camara dual de 48MP."
        />
        <Product
          _id="1003"
          img={spfThree}
          productName="AirPods Pro 2da Generacion"
          price="899.00"
          color="Blanco"
          badge={true}
          des="Cancelacion activa de ruido adaptativa, audio espacial personalizado y hasta 6 horas de reproduccion."
        />
        <Product
          _id="1004"
          img={spfFour}
          productName="Perfume Sauvage Dior EDT"
          price="320.00"
          color="Azul"
          badge={true}
          des="Fragancia masculina fresca y salvaje con notas de bergamota y ambroxan. Un clasico contemporaneo de Dior."
        />
      </div>
    </div>
  );
};

export default SpecialOffers;
