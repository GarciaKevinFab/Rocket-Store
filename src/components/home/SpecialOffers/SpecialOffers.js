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
          _id="1101"
          img={spfOne}
          productName="Gorra para Niños"
          price="35.00"
          color="Blanco y negro"
          badge={true}
          des="Una gorra con mucho estilo que te cubre del sol y te da mucho estilo."
        />
        <Product
          _id="1102"
          img={spfTwo}
          productName="Mesa de Té"
          price="180.00"
          color="Madera"
          badge={true}
          des="Excelente para esas tardes de relajación con un té que renueva el alma."
        />
        <Product
          _id="1103"
          img={spfThree}
          productName="Auriculares"
          price="25.00"
          color="Guinda"
          badge={true}
          des="Tipo vincha con sonido envolvente y muy cómodos para disfrutar tus caciones favoritas durante muchas horas."
        />
        <Product
          _id="1104"
          img={spfFour}
          productName="Gafas de sol"
          price="220.00"
          color="Negro"
          badge={true}
          des="Proteje tus ojos con la nueva tecnologia semiastroautica-espacial, que bloquea los rayos gamma que emiten los púlsares."
        />
      </div>
    </div>
  );
};

export default SpecialOffers;
