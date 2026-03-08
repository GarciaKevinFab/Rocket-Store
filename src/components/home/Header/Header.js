import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { logo } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";

const Header = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const location = useLocation();
  useEffect(() => {
    let ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);
    return () => window.removeEventListener("resize", ResponsiveMenu);
  }, []);

  return (
    <div className="w-full h-20 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <Link to="/">
            <div>
              <Image className="w-44 max-h-16 object-contain" imgSrc={logo} />
            </div>
          </Link>
          <div>
            {showMenu && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center w-auto z-50 p-0 gap-1"
              >
                {navBarList.map(({ _id, title, link }) => (
                  <NavLink
                    key={_id}
                    className={({ isActive }) =>
                      `flex font-titleFont font-medium text-sm px-5 py-2 rounded-lg duration-300 justify-center items-center ${
                        isActive
                          ? "text-primeColor bg-gray-50"
                          : "text-gray-500 hover:text-primeColor hover:bg-gray-50"
                      }`
                    }
                    to={link}
                    state={{ data: location.pathname.split("/")[1] }}
                  >
                    <li>{title}</li>
                  </NavLink>
                ))}
              </motion.ul>
            )}
            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4"
            />
            {sidenav && (
              <div className="fixed top-0 left-0 w-full h-screen bg-black/60 backdrop-blur-sm z-50">
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] max-w-[320px] h-full relative"
                >
                  <div className="w-full h-full bg-gradient-to-b from-primeColor to-gray-800 p-6 overflow-y-auto">
                    <img
                      className="w-40 mb-6 brightness-0 invert"
                      src={logo}
                      alt="logo"
                    />
                    <ul className="text-gray-200 flex flex-col gap-1">
                      {navBarList.map((item) => (
                        <li
                          className="font-titleFont font-medium text-base text-gray-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2.5 duration-300"
                          key={item._id}
                        >
                          <NavLink
                            to={item.link}
                            state={{ data: location.pathname.split("/")[1] }}
                            onClick={() => setSidenav(false)}
                          >
                            {item.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <h1
                        onClick={() => setCategory(!category)}
                        className="flex justify-between text-sm cursor-pointer items-center font-titleFont font-semibold mb-2 text-gray-300 hover:text-white duration-200"
                      >
                        Categorias
                        <span className="text-lg">{category ? "-" : "+"}</span>
                      </h1>
                      {category && (
                        <motion.ul
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-sm flex flex-col gap-1 ml-2"
                        >
                          {["Perfumes", "Smartphones", "Accesorios Tech", "Relojes", "Cuidado Personal"].map((cat) => (
                            <li key={cat} className="text-gray-400 hover:text-white py-1.5 px-2 rounded-lg hover:bg-white/10 duration-200 cursor-pointer">{cat}</li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                    <div className="mt-4">
                      <h1
                        onClick={() => setBrand(!brand)}
                        className="flex justify-between text-sm cursor-pointer items-center font-titleFont font-semibold mb-2 text-gray-300 hover:text-white duration-200"
                      >
                        Marca
                        <span className="text-lg">{brand ? "-" : "+"}</span>
                      </h1>
                      {brand && (
                        <motion.ul
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-sm flex flex-col gap-1 ml-2"
                        >
                          {["Apple", "Samsung", "Carolina Herrera", "Dior", "Paco Rabanne", "Versace"].map((b) => (
                            <li key={b} className="text-gray-400 hover:text-white py-1.5 px-2 rounded-lg hover:bg-white/10 duration-200 cursor-pointer">{b}</li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                  </div>
                  <span
                    onClick={() => setSidenav(false)}
                    className="w-8 h-8 border border-gray-400 absolute top-2 -right-10 text-gray-300 text-2xl flex justify-center items-center cursor-pointer hover:border-red-500 hover:text-red-500 rounded-lg duration-300"
                  >
                    <MdClose />
                  </span>
                </motion.div>
              </div>
            )}
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default Header;
