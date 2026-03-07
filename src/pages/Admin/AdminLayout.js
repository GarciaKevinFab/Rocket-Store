import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { MdDashboard, MdInventory, MdShoppingBag, MdArrowBack } from "react-icons/md";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: <MdDashboard /> },
  { path: "/admin/productos", label: "Productos", icon: <MdInventory /> },
  { path: "/admin/pedidos", label: "Pedidos", icon: <MdShoppingBag /> },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-primeColor text-white flex flex-col">
        <div className="p-6">
          <h1 className="font-titleFont text-xl font-bold">ROCKET Admin</h1>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200">
            <MdArrowBack className="text-lg" />
            Volver a la Tienda
          </Link>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
