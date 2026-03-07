import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { MdInventory, MdShoppingBag, MdAttachMoney, MdPending } from "react-icons/md";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsSnap, ordersSnap, pendingSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "orders")),
          getDocs(query(collection(db, "orders"), where("status", "==", "pendiente"))),
        ]);

        let revenue = 0;
        ordersSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.status !== "cancelado") revenue += data.total || 0;
        });

        setStats({
          products: productsSnap.size,
          orders: ordersSnap.size,
          revenue,
          pending: pendingSnap.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Productos", value: stats.products, icon: <MdInventory />, color: "bg-blue-500" },
    { label: "Pedidos", value: stats.orders, icon: <MdShoppingBag />, color: "bg-green-500" },
    { label: "Ingresos", value: `S/.${stats.revenue.toFixed(2)}`, icon: <MdAttachMoney />, color: "bg-purple-500" },
    { label: "Pendientes", value: stats.pending, icon: <MdPending />, color: "bg-yellow-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-titleFont font-bold mb-6">Dashboard</h1>
      {loading ? (
        <p className="text-gray-500">Cargando estadisticas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} text-white p-3 rounded-full text-2xl`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
