import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { MdDashboard, MdInventory, MdShoppingBag, MdArrowBack, MdMenu, MdClose, MdPeople, MdCategory } from "react-icons/md";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: <MdDashboard /> },
  { path: "/admin/productos", label: "Productos", icon: <MdInventory /> },
  { path: "/admin/categorias", label: "Categorías", icon: <MdCategory /> },
  { path: "/admin/pedidos", label: "Pedidos", icon: <MdShoppingBag />, showBadge: true },
  { path: "/admin/clientes", label: "Clientes", icon: <MdPeople /> },
];

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const q = query(collection(db, "orders"), where("status", "==", "pendiente"));
        const snap = await getDocs(q);
        setPendingCount(snap.size);
      } catch (e) { /* ignore */ }
    };
    fetchPending();
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primeColor to-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <h1 className="font-titleFont text-lg font-bold tracking-wide">RUME IMPORT</h1>
            <p className="text-xs text-gray-400 mt-0.5">Panel de Administración</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white text-2xl">
            <MdClose />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3 pt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.showBadge && pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200">
            <MdArrowBack className="text-xl" />
            Volver a la Tienda
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="text-primeColor text-2xl">
            <MdMenu />
          </button>
          <h1 className="font-titleFont text-lg font-bold text-primeColor">RUME IMPORT</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
