import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from "./shopBy/Price";

const ShopSideNav = ({ filters = {}, onFilterChange = () => {}, categories = [], brands = [] }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category categories={categories} activeCategory={filters.category} onSelect={(cat) => onFilterChange({ category: cat })} />
      <Price activePrice={filters.priceMin !== null ? `${filters.priceMin}-${filters.priceMax}` : ""} onSelect={(min, max) => onFilterChange({ priceMin: min, priceMax: max })} />
      <Brand brands={brands} activeBrand={filters.brand} onSelect={(brand) => onFilterChange({ brand })} />
      <Color activeColor={filters.color} onSelect={(color) => onFilterChange({ color })} />
    </div>
  );
};

export default ShopSideNav;
