import React from "react";
import NavTitle from "./NavTitle";

const Category = ({ categories = [], activeCategory = "", onSelect = () => {} }) => {
  const handleClick = (catName) => {
    onSelect(activeCategory === catName ? "" : catName);
  };

  return (
    <div className="w-full">
      <NavTitle title="Categorias" icons={false} />
      <div>
        <ul className="flex flex-col gap-1 text-sm text-gray-500">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => handleClick(cat.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer duration-200 ${
                  activeCategory === cat.name
                    ? "bg-primeColor text-white font-medium"
                    : "hover:bg-gray-50 hover:text-primeColor"
                }`}
              >
                {cat.icon && <span className="text-base">{cat.icon}</span>}
                <span className="flex-1">{cat.name}</span>
              </li>
            ))
          ) : (
            ["Perfumes", "Smartphones", "Accesorios Tech", "Relojes", "Cuidado Personal", "Otros"].map((title) => (
              <li
                key={title}
                onClick={() => handleClick(title)}
                className={`px-3 py-2 rounded-lg cursor-pointer duration-200 ${
                  activeCategory === title
                    ? "bg-primeColor text-white font-medium"
                    : "hover:bg-gray-50 hover:text-primeColor"
                }`}
              >
                {title}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Category;
