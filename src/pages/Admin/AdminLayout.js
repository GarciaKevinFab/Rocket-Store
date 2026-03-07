import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { MdDashboard, MdInventory, MdShoppingBag, MdArrowBack, MdMenu, MdClose, MdPeople } from "react-icons/md";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: <MdDashboard /> },
  { path: "/admin/productos", label: "Productos", icon: <MdInventory /> },
  { path: "/admin/pedidos", label: "Pedidos", icon: <MdShoppingBag /> },
  { path: "/admin/clientes", label: "Clientes", icon: <MdPeople /> },
];

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primeColor text-white flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="font-titleFont text-xl font-bold">RUME IMPORT Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white text-2xl">
            <MdClose />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-primeColor text-2xl">
            <MdMenu />
          </button>
          <h1 className="font-titleFont text-lg font-bold">RUME IMPORT Admin</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
