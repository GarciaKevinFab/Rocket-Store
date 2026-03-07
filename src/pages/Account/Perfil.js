import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { peruDepartments } from "../../constants/paymentConfig";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import toast from "react-hot-toast";

const Perfil = () => {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: userData?.displayName || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    district: userData?.district || "",
    city: userData?.city || "",
    department: userData?.department || "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), form);
      toast.success("Perfil actualizado!");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Mi Perfil" />
      <div className="pb-20 max-w-lg mx-auto">
        <h2 className="text-2xl font-titleFont font-semibold mb-6">Mi Perfil</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">Correo: {currentUser?.email}</p>
          <p className="text-sm text-gray-500">Rol: {userData?.role === "admin" ? "Administrador" : "Cliente"}</p>
        </div>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="font-titleFont text-sm font-semibold text-gray-600">Nombre completo</label>
            <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
          </div>
          <div>
            <label className="font-titleFont text-sm font-semibold text-gray-600">Telefono</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
          </div>
          <div>
            <label className="font-titleFont text-sm font-semibold text-gray-600">Direccion</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600">Departamento</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none bg-white">
                <option value="">Seleccionar</option>
                {peruDepartments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600">Ciudad</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
            </div>
          </div>
          <div>
            <label className="font-titleFont text-sm font-semibold text-gray-600">Distrito</label>
            <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full h-10 px-4 border border-gray-400 rounded-md outline-none" type="text" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-12 bg-primeColor text-white font-titleFont font-semibold rounded-md hover:bg-black duration-300 disabled:opacity-50 mt-2">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
