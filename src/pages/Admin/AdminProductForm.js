import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { createProduct, updateProduct, getProductById } from "../../services/productService";
import { getActiveCategories } from "../../services/categoryService";
import toast from "react-hot-toast";
import { MdArrowBack, MdCloudUpload, MdClose, MdPlayCircle } from "react-icons/md";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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
    videoUrl: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getActiveCategories();
        setCategories(cats);
      } catch (e) {
        console.error("Error loading categories:", e);
      }
    };
    loadCategories();
  }, []);

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
            videoUrl: product.videoUrl || "",
          });
          const imgs = product.images || (product.img ? [product.img] : []);
          setExistingImages(imgs);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const onDrop = useCallback((acceptedFiles) => {
    const total = existingImages.length + newFiles.length + acceptedFiles.length;
    if (total > 5) {
      toast.error("Maximo 5 imagenes por producto");
      return;
    }
    setNewFiles((prev) => [...prev, ...acceptedFiles]);
  }, [existingImages.length, newFiles.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  });

  const removeExisting = (index) => setExistingImages((prev) => prev.filter((_, i) => i !== index));
  const removeNew = (index) => setNewFiles((prev) => prev.filter((_, i) => i !== index));

  const totalImages = existingImages.length + newFiles.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.price) {
      toast.error("Nombre y precio son requeridos");
      return;
    }
    if (!isEditing && totalImages === 0) {
      toast.error("Seleccione al menos una imagen");
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
        await updateProduct(id, data, newFiles, existingImages);
        toast.success("Producto actualizado!");
      } else {
        await createProduct(data, newFiles);
        toast.success("Producto creado!");
      }
      navigate("/admin/productos");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el producto");
    }
    setLoading(false);
  };

  const sections = [
    { value: "", label: "Ninguna" },
    { value: "newArrival", label: "Nuevas Llegadas" },
    { value: "bestSeller", label: "Mas Vendidos" },
    { value: "specialOffer", label: "Oferta Especial" },
  ];

  const inputClass = "w-full h-11 px-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 text-sm";
  const labelClass = "block text-sm font-semibold text-gray-600 mb-1.5";

  return (
    <div>
      <button onClick={() => navigate("/admin/productos")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primeColor mb-4 duration-200">
        <MdArrowBack /> Volver a Productos
      </button>
      <h1 className="text-2xl font-titleFont font-bold mb-6">
        {isEditing ? "Editar Producto" : "Nuevo Producto"}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre del Producto *</label>
            <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className={inputClass} type="text" placeholder="Ej: Perfume Invictus Paco Rabanne" />
          </div>
          <div>
            <label className={labelClass}>Precio (S/.) *</label>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} type="number" step="0.01" placeholder="0.00" />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} type="number" placeholder="0" />
          </div>
          <div>
            <label className={labelClass}>Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass + " bg-gray-50"}>
              <option value="">Seleccionar</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.icon ? `${cat.icon} ${cat.name}` : cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Marca</label>
            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputClass} type="text" placeholder="Ej: Apple, Samsung, Dior" />
          </div>
          <div>
            <label className={labelClass}>Color <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} type="text" placeholder="Ej: Negro, Dorado" />
          </div>
          <div>
            <label className={labelClass}>Seccion en Home</label>
            <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className={inputClass + " bg-gray-50"}>
              {sections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripcion</label>
            <textarea value={form.des} onChange={(e) => setForm({ ...form, des: e.target.value })} className="w-full h-28 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 resize-none text-sm" placeholder="Describe el producto..." />
          </div>

          {/* Video URL */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              <MdPlayCircle className="inline mr-1 text-red-500" />
              Video URL <span className="text-gray-400 font-normal">(opcional - YouTube o enlace directo)</span>
            </label>
            <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputClass} type="url" placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          {/* Multi-image upload */}
          <div className="md:col-span-2">
            <label className={labelClass}>Imagenes del Producto {!isEditing && "*"} <span className="text-gray-400 font-normal">({totalImages}/5)</span></label>

            {totalImages > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                {existingImages.map((url, i) => (
                  <div key={`ex-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute top-1 left-1 bg-primeColor text-white text-[10px] px-1.5 py-0.5 rounded">Principal</span>}
                    <button type="button" onClick={() => removeExisting(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                      <MdClose className="text-sm" />
                    </button>
                  </div>
                ))}
                {newFiles.map((file, i) => (
                  <div key={`nw-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-blue-300">
                    <img src={URL.createObjectURL(file)} alt={`new-${i}`} className="w-full h-full object-cover" />
                    {existingImages.length === 0 && i === 0 && <span className="absolute top-1 left-1 bg-primeColor text-white text-[10px] px-1.5 py-0.5 rounded">Principal</span>}
                    <button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                      <MdClose className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalImages < 5 && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer duration-300 ${
                  isDragActive ? "border-primeColor bg-primeColor/5" : "border-gray-200 hover:border-primeColor"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <MdCloudUpload className="text-4xl text-gray-300" />
                  <p className="text-gray-500 text-sm">Arrastra imagenes o haz click para seleccionar</p>
                  <p className="text-gray-300 text-xs">JPG, PNG, WEBP — Maximo 5 imagenes</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.checked })} className="w-4 h-4 accent-primeColor" />
              <span className="text-sm font-medium text-gray-600">Etiqueta "Nuevo"</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-primeColor" />
              <span className="text-sm font-medium text-gray-600">Producto Activo</span>
            </label>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button type="submit" disabled={loading} className="flex-1 h-12 bg-primeColor text-white font-semibold rounded-lg hover:bg-black duration-300 disabled:opacity-50 text-sm">
            {loading ? "Guardando..." : isEditing ? "Actualizar Producto" : "Crear Producto"}
          </button>
          <button type="button" onClick={() => navigate("/admin/productos")} className="flex-1 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 duration-300 text-sm font-medium">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
