import React from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  bestSellerOne,
  bestSellerTwo,
  bestSellerThree,
  bestSellerFour,
} from "../../../assets/images/index";

const BestSellers = () => {
  return (
    <div className="w-full pb-20">
      <Heading heading="Nuestros mas vendidos" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        <Product
          _id="1005"
          img={bestSellerOne}
          productName="Crema Hidratante Facial Premium"
          price="85.00"
          color="Blanco"
          badge={true}
          des="Crema hidratante con acido hialuronico y vitamina E. Hidratacion profunda de 24 horas para todo tipo de piel."
        />
        <Product
          _id="1006"
          img={bestSellerTwo}
          productName="Funda Silicona iPhone 15"
          price="79.00"
          color="Negro"
          badge={false}
          des="Funda oficial de silicona con interior de microfibra suave. Proteccion premium contra caidas y rayones."
        />
        <Product
          _id="1007"
          img={bestSellerThree}
          productName="Cargador MagSafe Apple"
          price="199.00"
          color="Blanco"
          badge={true}
          des="Cargador inalambrico magnetico compatible con iPhone 12 en adelante. Carga rapida de 15W con alineacion perfecta."
        />
        <Product
          _id="1008"
          img={bestSellerFour}
          productName="Perfume 212 VIP Carolina Herrera"
          price="275.00"
          color="Dorado"
          badge={false}
          des="Fragancia sofisticada con notas de maracuya, ron y almizcle. Para el hombre que vive la noche con estilo."
        />
      </div>
    </div>
  );
};

export default BestSellers;
