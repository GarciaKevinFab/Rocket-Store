import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { Link } from "react-router-dom";
import { MdInventory, MdShoppingBag, MdAttachMoney, MdPending, MdPeople, MdTrendingUp } from "react-icons/md";
import { orderStatuses } from "../../constants/paymentConfig";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0, customers: 0 });
  const [statusCounts, setStatusCounts] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsSnap, ordersSnap, pendingSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "orders"), where("status", "==", "pendiente"))),
          getDocs(collection(db, "users")),
        ]);

        let revenue = 0;
        const guestEmails = new Set();
        const sCounts = {};
        const monthly = {};
        const productSales = {};

        ordersSnap.docs.forEach((d) => {
          const data = d.data();
          if (data.status !== "cancelado") revenue += data.total || 0;
          if (data.isGuest && data.guestEmail) guestEmails.add(data.guestEmail);
          sCounts[data.status] = (sCounts[data.status] || 0) + 1;
          if (data.createdAt && data.status !== "cancelado") {
            const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            monthly[key] = (monthly[key] || 0) + (data.total || 0);
          }
          if (data.items && data.status !== "cancelado") {
            data.items.forEach((item) => {
              const name = item.productName || item.name;
              if (!name) return;
              if (!productSales[name]) productSales[name] = { name, qty: 0, revenue: 0 };
              productSales[name].qty += item.quantity || 1;
              productSales[name].revenue += item.subtotal || (Number(item.price) * (item.quantity || 1));
            });
          }
        });

        const registeredCustomers = usersSnap.docs.filter((d) => d.data().role !== "admin").length;

        setStats({ products: productsSnap.size, orders: ordersSnap.size, revenue, pending: pendingSnap.size, customers: registeredCustomers + guestEmails.size });
        setStatusCounts(sCounts);

        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
          const label = dt.toLocaleDateString("es-PE", { month: "short" }).replace(".", "");
          months.push({ key, label: label.charAt(0).toUpperCase() + label.slice(1), value: monthly[key] || 0 });
        }
        setMonthlyRevenue(months);

        setTopProducts(Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5));
        setRecentOrders(ordersSnap.docs.slice(0, 5).map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" });
  };

  const cards = [
    { label: "Productos", value: stats.products, icon: <MdInventory />, bg: "from-blue-500 to-blue-600" },
    { label: "Pedidos", value: stats.orders, icon: <MdShoppingBag />, bg: "from-emerald-500 to-emerald-600" },
    { label: "Ingresos", value: `S/.${stats.revenue.toFixed(2)}`, icon: <MdAttachMoney />, bg: "from-purple-500 to-purple-600" },
    { label: "Pendientes", value: stats.pending, icon: <MdPending />, bg: "from-amber-500 to-amber-600" },
    { label: "Clientes", value: stats.customers, icon: <MdPeople />, bg: "from-indigo-500 to-indigo-600" },
  ];

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-titleFont font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-sm">
              <div className="h-3 bg-gray-200 rounded w-16 mb-3" />
              <div className="h-7 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxMonthly = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const maxTopQty = topProducts.length > 0 ? topProducts[0].qty : 1;

  return (
    <div>
      <h1 className="text-2xl font-titleFont font-bold mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold mt-1 text-primeColor">{card.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${card.bg} text-white p-3 rounded-xl text-xl shadow-sm`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <MdTrendingUp className="text-xl text-purple-500" />
            <h2 className="font-semibold text-lg">Ingresos Mensuales</h2>
          </div>
          <div className="flex items-end gap-3 h-48">
            {monthlyRevenue.map((month) => (
              <div key={month.key} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  {month.value > 0 ? `S/.${month.value >= 1000 ? (month.value / 1000).toFixed(1) + "k" : Math.round(month.value)}` : ""}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{ height: `${Math.max((month.value / maxMonthly) * 100, 3)}%` }}
                />
                <span className="text-xs text-gray-500 font-medium">{month.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg mb-6">Pedidos por Estado</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(orderStatuses).map(([key, val]) => {
              const count = statusCounts[key] || 0;
              const total = stats.orders || 1;
              const pct = Math.round((count / total) * 100);
              const colorMap = { pendiente: "bg-yellow-400", pago_verificado: "bg-blue-400", preparando: "bg-orange-400", enviado: "bg-purple-400", entregado: "bg-green-400", cancelado: "bg-red-400" };
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24 truncate">{val.label}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colorMap[key] || "bg-gray-400"} rounded-full transition-all duration-700`} style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Pedidos Recientes</h2>
            <Link to="/admin/pedidos" className="text-sm text-primeColor hover:underline font-medium">Ver todos</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No hay pedidos aun</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wide">
                    <th className="text-left pb-3">Pedido</th>
                    <th className="text-left pb-3">Cliente</th>
                    <th className="text-left pb-3">Total</th>
                    <th className="text-left pb-3">Estado</th>
                    <th className="text-left pb-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-50">
                      <td className="py-2.5">
                        <Link to={`/admin/pedidos/${order.id}`} className="font-mono text-xs text-primeColor hover:underline">
                          #{order.id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-2.5 text-xs text-gray-600 max-w-[100px] truncate">{order.userName}</td>
                      <td className="py-2.5 font-semibold text-xs">S/.{order.total?.toFixed(2)}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${orderStatuses[order.status]?.color || "bg-gray-100"}`}>
                          {orderStatuses[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-gray-400">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg mb-4">Productos Mas Vendidos</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No hay datos de ventas aun</p>
          ) : (
            <div className="flex flex-col gap-4">
              {topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primeColor to-gray-600 rounded-full" style={{ width: `${(product.qty / maxTopQty) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{product.qty} uds</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primeColor whitespace-nowrap">S/.{product.revenue.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
