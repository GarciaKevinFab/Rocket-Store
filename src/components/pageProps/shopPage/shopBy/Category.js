import React, { useState } from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";

const Category = () => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);
  const items = [
    { _id: 990, title: "Perfumes", icons: true },
    { _id: 991, title: "Smartphones" },
    { _id: 992, title: "Accesorios Tech", icons: true },
    { _id: 993, title: "Relojes" },
    { _id: 994, title: "Cuidado Personal" },
    { _id: 995, title: "Otros" },
  ];
  return (
    <div className="w-full">
      <NavTitle title="Categorias" icons={false} />
      <div>
        <ul className="flex flex-col gap-2 text-sm text-gray-500">
          {items.map(({ _id, title, icons }) => (
            <li
              key={_id}
              className="border-b border-gray-100 pb-2 flex items-center justify-between hover:text-primeColor duration-200 cursor-pointer rounded-lg hover:bg-gray-50 px-2 py-1"
            >
              {title}
              {icons && (
                <span
                  onClick={() => setShowSubCatOne(!showSubCatOne)}
                  className="text-[10px] cursor-pointer text-gray-300 hover:text-primeColor duration-300"
                >
                  <ImPlus />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
