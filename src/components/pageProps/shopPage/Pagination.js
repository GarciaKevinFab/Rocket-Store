import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import { paginationItems } from "../../../constants";
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import Image from "../../designLayouts/Image";
import Badge from "../../home/Products/Badge";

const items = paginationItems;

function GridItems({ currentItems }) {
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

function ListItem({ item }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDetails = () => {
    navigate(`/product/${item._id}`, { state: { item } });
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md duration-300">
      <div className="w-full sm:w-52 h-52 flex-shrink-0 relative cursor-pointer" onClick={handleDetails}>
        <Image className="w-full h-full object-cover" imgSrc={item.img} />
        {item.badge && (
          <div className="absolute top-3 left-3">
            <Badge text="Nuevo" />
          </div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 onClick={handleDetails} className="text-lg font-bold font-titleFont text-primeColor hover:underline cursor-pointer mb-1">
            {item.productName}
          </h2>
          <p className="text-xs text-gray-400 mb-2">{item.color}</p>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.des}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-primeColor">S/.{item.price}</p>
          <button
            onClick={() =>
              dispatch(
                addToCart({
                  _id: item._id,
                  name: item.productName,
                  quantity: 1,
                  image: item.img,
                  badge: item.badge,
                  price: item.price,
                  colors: item.color,
                })
              )
            }
            className="flex items-center gap-2 px-4 py-2 bg-primeColor text-white text-sm font-medium rounded-lg hover:bg-black duration-300"
          >
            <FaShoppingCart className="text-xs" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

const Pagination = ({ itemsPerPage, gridView = true }) => {
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

      {/* Products - Grid or List */}
      {gridView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mdl:gap-4 lg:gap-6">
          <GridItems currentItems={currentItems} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {currentItems.map((item) => (
            <ListItem key={item._id} item={item} />
          ))}
        </div>
      )}

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
