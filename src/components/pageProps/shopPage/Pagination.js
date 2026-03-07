import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import { paginationItems } from "../../../constants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const items = paginationItems;
function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id} className="w-full">
            <Product
              _id={item._id}
              img={item.img}
              productName={item.productName}
              price={item.price}
              color={item.color}
              badge={item.badge}
              des={item.des}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setItemStart(newOffset);
  };

  return (
    <div>
      {/* Results info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-primeColor">{itemStart === 0 ? 1 : itemStart}</span> - <span className="font-semibold text-primeColor">{Math.min(endOffset, items.length)}</span> de <span className="font-semibold text-primeColor">{items.length}</span> productos
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mdl:gap-4 lg:gap-6">
        <Items currentItems={currentItems} />
      </div>

      {/* Pagination */}
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center mt-8 pt-6 border-t border-gray-100">
        <ReactPaginate
          nextLabel={<FaChevronRight className="text-xs" />}
          previousLabel={<FaChevronLeft className="text-xs" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          pageLinkClassName="w-9 h-9 border border-gray-200 hover:border-primeColor hover:text-primeColor duration-300 flex justify-center items-center rounded-lg text-sm"
          pageClassName="mr-1.5"
          containerClassName="flex items-center text-sm font-semibold font-titleFont py-6 gap-1"
          activeClassName="bg-primeColor text-white rounded-lg"
          previousClassName="mr-2"
          nextClassName="ml-2"
          previousLinkClassName="w-9 h-9 border border-gray-200 hover:border-primeColor hover:text-primeColor duration-300 flex justify-center items-center rounded-lg"
          nextLinkClassName="w-9 h-9 border border-gray-200 hover:border-primeColor hover:text-primeColor duration-300 flex justify-center items-center rounded-lg"
          disabledClassName="opacity-30"
        />
        <p className="text-xs text-gray-400 mt-2 mdl:mt-0">
          Pagina {Math.floor(itemOffset / itemsPerPage) + 1} de {pageCount}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
