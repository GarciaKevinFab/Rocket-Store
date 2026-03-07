import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { peruDepartments } from "../../constants/paymentConfig";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa";

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
      <div className="pb-20 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primeColor to-gray-800 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaUser className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-titleFont">{form.displayName || "Mi Perfil"}</h2>
              <div className="flex items-center gap-2 mt-1">
                <FaEnvelope className="text-xs text-white/60" />
                <p className="text-sm text-white/80">{currentUser?.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <FaShieldAlt className="text-xs text-white/60" />
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {userData?.role === "admin" ? "Administrador" : "Cliente"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-bold font-titleFont text-primeColor mb-6">Datos Personales</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600 mb-1.5 block">Nombre completo</label>
              <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-primeColor duration-200 text-sm bg-gray-50" type="text" placeholder="Tu nombre completo" />
            </div>
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600 mb-1.5 block">Telefono</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-primeColor duration-200 text-sm bg-gray-50" type="text" placeholder="999 999 999" />
            </div>
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600 mb-1.5 block">Direccion</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-primeColor duration-200 text-sm bg-gray-50" type="text" placeholder="Av. Principal 123" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-titleFont text-sm font-semibold text-gray-600 mb-1.5 block">Departamento</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-primeColor duration-200 text-sm bg-gray-50 cursor-pointer">
                  <option value="">Seleccionar</option>
                  {peruDepartments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
              <div>
                <label className="font-titleFont text-sm font-semibold text-gray-600 mb-1.5 block">Ciudad</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-primeColor duration-200 text-sm bg-gray-50" type="text" placeholder="Lima" />
              </div>
            </div>
            <div>
              <label className="font-titleFont text-sm font-semibold text-gray-600 mb-1.5 block">Distrito</label>
              <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:border-primeColor duration-200 text-sm bg-gray-50" type="text" placeholder="Miraflores" />
            </div>
            <button type="submit" disabled={loading} className="w-full h-12 bg-primeColor text-white font-titleFont font-semibold text-sm rounded-xl hover:bg-black duration-300 disabled:opacity-50 mt-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
