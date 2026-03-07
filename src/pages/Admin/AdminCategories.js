import React, { useEffect, useState } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import { MdAdd, MdEdit, MdDelete, MdClose, MdDragIndicator } from "react-icons/md";
import toast from "react-hot-toast";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", icon: "", order: 0 });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm({ name: "", icon: "", order: categories.length });
    setShowForm(true);
  };

  const handleOpenEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, icon: cat.icon || "", order: cat.order || 0 });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        toast.success("Categoría actualizada");
      } else {
        await createCategory(form);
        toast.success("Categoría creada");
      }
      setShowForm(false);
      setEditing(null);
      fetchCategories();
    } catch (error) {
      toast.error("Error al guardar");
    }
    setSaving(false);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.id);
      toast.success("Categoría eliminada");
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Error al eliminar");
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      await updateCategory(cat.id, { active: !cat.active });
      toast.success(cat.active ? "Categoría desactivada" : "Categoría activada");
      fetchCategories();
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const emojiOptions = ["🧴", "📱", "⌚", "🎧", "💄", "👟", "🎮", "🏠", "🔧", "📦"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-titleFont font-bold">Categorías</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-primeColor text-white px-5 py-2.5 rounded-lg hover:bg-black duration-300 text-sm font-medium shadow-sm"
        >
          <MdAdd className="text-lg" />
          Nueva Categoría
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editing ? "Editar Categoría" : "Nueva Categoría"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Nombre *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Perfumes"
                  className="w-full h-11 px-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Ícono (emoji)</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, icon: emoji })}
                      className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg border-2 duration-200 ${
                        form.icon === emoji ? "border-primeColor bg-primeColor/5 shadow-sm" : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="O escribe tu emoji..."
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Orden</label>
                <input
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  type="number"
                  className="w-full h-11 px-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-primeColor duration-200 text-sm"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-11 bg-primeColor text-white font-medium rounded-lg hover:bg-black duration-300 disabled:opacity-50 text-sm"
                >
                  {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-11 border border-gray-300 rounded-lg hover:bg-gray-50 duration-200 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-gray-500 font-medium">No hay categorías creadas</p>
          <p className="text-gray-400 text-sm mt-1">Crea tu primera categoría para organizar los productos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md duration-300 group"
            >
              <div className="text-gray-300 cursor-grab">
                <MdDragIndicator className="text-xl" />
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                {cat.icon || "📦"}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primeColor">{cat.name}</h3>
                <p className="text-xs text-gray-400">Orden: {cat.order}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleActive(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium duration-200 ${
                    cat.active !== false
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {cat.active !== false ? "Activa" : "Inactiva"}
                </button>
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg duration-200"
                >
                  <MdEdit className="text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg duration-200"
                >
                  <MdDelete className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
