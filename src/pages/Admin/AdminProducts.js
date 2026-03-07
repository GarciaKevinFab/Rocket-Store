import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, updateProduct } from "../../services/productService";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
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
        <Link to="/admin/productos/nuevo" className="bg-primeColor text-white px-6 py-2 rounded-md hover:bg-black duration-300 text-sm font-medium whitespace-nowrap">
          + Nuevo Producto
        </Link>
      </div>
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full max-w-md h-10 px-4 border border-gray-300 rounded-md outline-none"
        />
      </div>
      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Imagen</th>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Precio</th>
                <th className="text-left px-4 py-3 font-semibold">Categoria</th>
                <th className="text-left px-4 py-3 font-semibold">Stock</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-left px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.img && <img src={product.img} alt="" className="w-12 h-12 object-cover rounded" />}
                  </td>
                  <td className="px-4 py-3 font-medium">{product.productName}</td>
                  <td className="px-4 py-3">S/.{Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-3">{product.category || "---"}</td>
                  <td className="px-4 py-3">{product.stock ?? "---"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.active !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {product.active !== false ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/productos/editar/${product.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                        Editar
                      </Link>
                      <button onClick={() => toggleActive(product)} className="text-gray-500 hover:text-primeColor text-sm">
                        {product.active !== false ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8">No se encontraron productos</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
