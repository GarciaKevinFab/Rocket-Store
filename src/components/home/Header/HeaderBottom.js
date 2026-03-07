import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const { currentUser, userData, logout } = useAuth();
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const userRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUser(false);
      }
    };
    document.body.addEventListener("click", handleClick);
    return () => document.body.removeEventListener("click", handleClick);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUser(false);
      toast.success("Sesion cerrada");
      navigate("/");
    } catch (error) {
      toast.error("Error al cerrar sesion");
    }
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-16">
          <div onClick={() => setShow(!show)} ref={ref} className="flex h-14 cursor-pointer items-center gap-2 text-primeColor">
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-medium">Categorias</p>
            {show && (
              <motion.ul initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="absolute top-36 lg:top-14 z-50 bg-white w-48 shadow-xl rounded-lg border border-gray-100 overflow-hidden">
                {["Perfumes", "Smartphones", "Accesorios Tech", "Relojes", "Cuidado Personal"].map((cat) => (
                  <li key={cat} className="text-gray-600 px-4 py-2.5 hover:bg-primeColor hover:text-white duration-200 cursor-pointer text-sm">{cat}</li>
                ))}
              </motion.ul>
            )}
          </div>
          <div className="relative w-full lg:w-[600px] h-[44px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-5 rounded-full border border-gray-200 shadow-sm">
            <input className="flex-1 h-full outline-none placeholder:text-gray-400 placeholder:text-[13px] text-sm" type="text" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} placeholder="Busca tus productos aqui..." />
            <FaSearch className="w-4 h-4 text-gray-400" />
            {searchQuery && (
              <div className="w-full mx-auto max-h-96 bg-white top-12 absolute left-0 z-50 overflow-y-scroll shadow-xl rounded-lg border border-gray-100 scrollbar-hide cursor-pointer">
                {filteredProducts.map((item) => (
                  <div
                    onClick={() => {
                      navigate(`/product/${item._id}`, { state: { item: item } });
                      setSearchQuery("");
                    }}
                    key={item._id}
                    className="h-20 px-4 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 duration-200"
                  >
                    <img className="w-14 h-14 object-cover rounded-lg" src={item.img} alt="productImg" />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.productName}</p>
                      <p className="text-xs text-gray-400 truncate">{item.des}</p>
                    </div>
                    <p className="text-sm font-bold text-primeColor whitespace-nowrap">S/.{item.price}</p>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="text-center py-4 text-sm text-gray-400">No se encontraron productos</p>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div ref={userRef} onClick={() => setShowUser(!showUser)} className="flex items-center gap-1 hover:text-primeColor duration-200">
              <FaUser className="text-sm" />
              <FaCaretDown className="text-xs" />
            </div>
            {showUser && (
              <motion.ul initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="absolute top-8 left-0 z-50 bg-white w-48 shadow-xl rounded-lg border border-gray-100 overflow-hidden">
                {currentUser ? (
                  <>
                    <li className="text-gray-800 px-4 py-2 border-b border-gray-100 text-sm font-medium bg-gray-50">Hola, {userData?.displayName || "Usuario"}</li>
                    {userData?.role === "admin" && (
                      <Link to="/admin" onClick={() => setShowUser(false)}>
                        <li className="text-gray-600 px-4 py-2.5 hover:bg-primeColor hover:text-white duration-200 cursor-pointer text-sm">Panel Admin</li>
                      </Link>
                    )}
                    <Link to="/mis-pedidos" onClick={() => setShowUser(false)}>
                      <li className="text-gray-600 px-4 py-2.5 hover:bg-primeColor hover:text-white duration-200 cursor-pointer text-sm">Mis Pedidos</li>
                    </Link>
                    <Link to="/perfil" onClick={() => setShowUser(false)}>
                      <li className="text-gray-600 px-4 py-2.5 hover:bg-primeColor hover:text-white duration-200 cursor-pointer text-sm">Perfil</li>
                    </Link>
                    <li onClick={handleLogout} className="text-red-500 px-4 py-2.5 hover:bg-red-50 duration-200 cursor-pointer text-sm border-t border-gray-100">Cerrar Sesion</li>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setShowUser(false)}>
                      <li className="text-gray-600 px-4 py-2.5 hover:bg-primeColor hover:text-white duration-200 cursor-pointer text-sm">Iniciar Sesion</li>
                    </Link>
                    <Link to="/signup" onClick={() => setShowUser(false)}>
                      <li className="text-gray-600 px-4 py-2.5 hover:bg-primeColor hover:text-white duration-200 cursor-pointer text-sm">Registrarse</li>
                    </Link>
                    <Link to="/rastrear-pedido" onClick={() => setShowUser(false)}>
                      <li className="text-gray-600 px-4 py-2.5 hover:bg-primeColor hover:text-white duration-200 cursor-pointer text-sm border-t border-gray-100">Rastrear Pedido</li>
                    </Link>
                  </>
                )}
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative hover:text-primeColor duration-200">
                <FaShoppingCart />
                <span className="absolute font-titleFont -top-2 -right-3 text-[10px] w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">{products.length > 0 ? products.length : 0}</span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
