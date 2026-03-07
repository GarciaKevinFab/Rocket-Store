import React from "react";
import NavTitle from "./NavTitle";

const Price = () => {
  const priceList = [
    { _id: 950, priceOne: 0.0, priceTwo: 49.99 },
    { _id: 951, priceOne: 50.0, priceTwo: 99.99 },
    { _id: 952, priceOne: 100.0, priceTwo: 199.99 },
    { _id: 953, priceOne: 200.0, priceTwo: 399.99 },
    { _id: 954, priceOne: 400.0, priceTwo: 599.99 },
    { _id: 955, priceOne: 600.0, priceTwo: 1000.0 },
  ];
  return (
    <div className="cursor-pointer">
      <NavTitle title="Precio" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-2 text-sm text-gray-500">
          {priceList.map((item) => (
            <li
              key={item._id}
              className="border-b border-gray-100 pb-2 flex items-center gap-2 hover:text-primeColor duration-200 rounded-lg hover:bg-gray-50 px-2 py-1"
            >
              S/.{item.priceOne.toFixed(2)} - S/.{item.priceTwo.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
