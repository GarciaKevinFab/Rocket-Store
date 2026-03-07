import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, updateProduct } from "../../services/productService";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleActive = async (product) => {
    try {
      await updateProduct(product.id, { active: !product.active });
      toast.success(product.active ? "Producto desactivado" : "Producto activado");
      fetchProducts();
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const filtered = products.filter((p) =>
    p.productName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-titleFont font-bold">Productos</h1>
        <Link to="/admin/productos/nuevo" className="flex items-center gap-2 bg-primeColor text-white px-5 py-2.5 rounded-lg hover:bg-black duration-300 text-sm font-medium shadow-sm">
          <MdAdd className="text-lg" /> Nuevo Producto
        </Link>
      </div>

      <div className="mb-5 relative max-w-md">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto..." className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 text-sm" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-40 mb-2" /><div className="h-3 bg-gray-100 rounded w-20" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50/80">
              <tr>
                {["Imagen", "Nombre", "Precio", "Categoria", "Stock", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50/50 duration-150">
                  <td className="px-4 py-3">
                    {product.img ? <img src={product.img} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" /> : <div className="w-12 h-12 bg-gray-100 rounded-lg" />}
                  </td>
                  <td className="px-4 py-3 font-medium text-primeColor">{product.productName}</td>
                  <td className="px-4 py-3 font-semibold">S/.{Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">{product.category || "---"}</td>
                  <td className="px-4 py-3">{product.stock ?? "---"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.active !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.active !== false ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/productos/editar/${product.id}`} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 duration-200">Editar</Link>
                      <button onClick={() => toggleActive(product)} className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 duration-200">
                        {product.active !== false ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12"><p className="text-4xl mb-2">📦</p><p className="text-gray-500">No se encontraron productos</p></div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
