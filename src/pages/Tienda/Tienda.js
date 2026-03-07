import React, { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import { FaFilter } from "react-icons/fa";
import { getProducts } from "../../services/productService";
import { getActiveCategories } from "../../services/categoryService";

const Tienda = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [gridView, setGridView] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    color: "",
    priceMin: null,
    priceMax: null,
    search: "",
  });

  useEffect(() => {
    const loadCats = async () => {
      try {
        const cats = await getActiveCategories();
        setCategories(cats);
      } catch (e) { console.error(e); }
    };
    loadCats();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(filters);
        setProducts(data);
      } catch (e) {
        console.error("Error loading products:", e);
        setProducts([]);
      }
      setLoading(false);
    };
    loadProducts();
  }, [filters]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ category: "", brand: "", color: "", priceMin: null, priceMax: null, search: "" });
  }, []);

  const itemsPerPageFromBanner = (val) => setItemsPerPage(val);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price_asc": return Number(a.price) - Number(b.price);
      case "price_desc": return Number(b.price) - Number(a.price);
      case "name_asc": return (a.productName || "").localeCompare(b.productName || "");
      case "name_desc": return (b.productName || "").localeCompare(a.productName || "");
      default: return 0;
    }
  });

  const allBrands = [...new Set(products.filter((p) => p.brand).map((p) => p.brand))];
  const hasActiveFilters = filters.category || filters.brand || filters.color || filters.priceMin !== null;

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Productos" />

      {/* Mobile filter toggle */}
      <div className="mdl:hidden mb-4 flex items-center gap-3">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-primeColor hover:text-primeColor duration-200 shadow-sm"
        >
          <FaFilter className="text-xs" />
          {showMobileFilter ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="text-xs text-red-500 hover:text-red-700 underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Mobile filters */}
      {showMobileFilter && (
        <div className="mdl:hidden mb-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <ShopSideNav filters={filters} onFilterChange={handleFilterChange} categories={categories} brands={allBrands} />
        </div>
      )}

      <div className="w-full h-full flex pb-20 gap-8">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <ShopSideNav filters={filters} onFilterChange={handleFilterChange} categories={categories} brands={allBrands} />
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="w-full mt-4 text-xs text-red-500 hover:text-red-700 underline text-center">
                Limpiar todos los filtros
              </button>
            )}
          </div>
        </div>

        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-6">
          <ProductBanner
            itemsPerPageFromBanner={itemsPerPageFromBanner}
            gridView={gridView}
            setGridView={setGridView}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <Pagination
            items={sortedProducts}
            itemsPerPage={itemsPerPage}
            gridView={gridView}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Tienda;
