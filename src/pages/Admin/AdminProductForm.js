import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { createProduct, updateProduct, getProductById } from "../../services/productService";
import toast from "react-hot-toast";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    price: "",
    color: "",
    category: "",
    brand: "",
    des: "",
    stock: "",
    badge: false,
    section: "",
    active: true,
  });

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        const product = await getProductById(id);
        if (product) {
          setForm({
            productName: product.productName || "",
            price: product.price || "",
            color: product.color || "",
            category: product.category || "",
            brand: product.brand || "",
            des: product.des || "",
            stock: product.stock || "",
            badge: product.badge || false,
            section: product.section || "",
            active: product.active !== false,
          });
          if (product.img) setImagePreview(product.img);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.price) {
      toast.error("Nombre y precio son requeridos");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        stock: form.stock ? Number(form.stock) : 0,
      };

      if (isEditing) {
        await updateProduct(id, data, imageFile);
        toast.success("Producto actualizado!");
      } else {
        if (!imageFile) {
          toast.error("Seleccione una imagen");
          setLoading(false);
          return;
        }
        await createProduct(data, imageFile);
        toast.success("Producto creado!");
      }
      navigate("/admin/productos");
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
    setLoading(false);
  };

  const categories = ["Perfumes", "Smartphones", "Accesorios Tech", "Relojes", "Cuidado Personal", "Otros"];
  const sections = [
    { value: "", label: "Ninguna" },
    { value: "newArrival", label: "Nuevas Llegadas" },
    { value: "bestSeller", label: "Mas Vendidos" },
    { value: "specialOffer", label: "Oferta Especial" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-titleFont font-bold mb-6">
        {isEditing ? "Editar Producto" : "Nuevo Producto"}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre del Producto *</label>
            <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none" type="text" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Precio (S/.) *</label>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none" type="number" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Stock</label>
            <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none" type="number" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none bg-white">
              <option value="">Seleccionar</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Marca</label>
            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none" type="text" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Color</label>
            <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none" type="text" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Seccion en Home</label>
            <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none bg-white">
              {sections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Descripcion</label>
            <textarea value={form.des} onChange={(e) => setForm({ ...form, des: e.target.value })} className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md outline-none resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Imagen del Producto</label>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-primeColor duration-300">
              <input {...getInputProps()} />
              {imagePreview ? (
                <div>
                  <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-md" />
                  <p className="text-sm text-gray-500 mt-2">Clic para cambiar imagen</p>
                </div>
              ) : (
                <p className="text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm font-medium">Etiqueta "Nuevo"</span>
            </label>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={loading} className="flex-1 h-12 bg-primeColor text-white font-semibold rounded-md hover:bg-black duration-300 disabled:opacity-50">
            {loading ? "Guardando..." : isEditing ? "Actualizar Producto" : "Crear Producto"}
          </button>
          <button type="button" onClick={() => navigate("/admin/productos")} className="flex-1 h-12 border border-gray-400 rounded-md hover:bg-gray-50 duration-300">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
