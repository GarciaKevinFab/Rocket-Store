import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../../assets/images";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmail = (e) => { setEmail(e.target.value); setErrEmail(""); };
  const handlePassword = (e) => { setPassword(e.target.value); setErrPassword(""); };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email) { setErrEmail("Ingrese su correo electronico"); return; }
    if (!password) { setErrPassword("Ingrese su contrasena"); return; }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bienvenido/a de vuelta!");
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrEmail("Usuario no encontrado");
      } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        setErrPassword("Contrasena incorrecta");
      } else {
        setErrEmail("Error al iniciar sesion");
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-gradient-to-b from-primeColor to-gray-800 px-10 flex flex-col gap-6 justify-center">
          <Link to="/"><img src={logo} alt="logoImg" className="w-28" /></Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Bienvenido de vuelta</h1>
            <p className="text-sm text-gray-300">Inicia sesion para acceder a tu cuenta</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-400 mt-1"><BsCheckCircleFill /></span>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-semibold font-titleFont">Compra rapido con RUME IMPORT</span><br />
              Acceso directo a tu carrito y pedidos guardados.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-400 mt-1"><BsCheckCircleFill /></span>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-semibold font-titleFont">Ofertas exclusivas para miembros</span><br />
              Descuentos especiales y acceso anticipado a nuevos productos.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-400 mt-1"><BsCheckCircleFill /></span>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-semibold font-titleFont">Productos 100% originales</span><br />
              Garantia de autenticidad en todos nuestros productos.
            </p>
          </div>
          <div className="flex items-center gap-6 mt-10">
            <Link to="/"><p className="text-xs font-titleFont text-gray-400 hover:text-white cursor-pointer duration-300">&copy; RUME IMPORT</p></Link>
            <p className="text-xs font-titleFont text-gray-400 hover:text-white cursor-pointer duration-300">Terminos</p>
            <p className="text-xs font-titleFont text-gray-400 hover:text-white cursor-pointer duration-300">Privacidad</p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full flex items-center justify-center px-6">
        <form onSubmit={handleSignIn} className="w-full max-w-[420px] flex flex-col justify-center">
          <h1 className="font-titleFont font-bold text-2xl md:text-3xl mb-2 text-primeColor">Iniciar sesion</h1>
          <p className="text-sm text-gray-400 mb-6">Ingresa tus datos para continuar</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-titleFont text-sm font-semibold text-gray-600">Correo Electronico</label>
              <input onChange={handleEmail} value={email} className="w-full h-11 placeholder:text-sm px-4 text-sm font-medium rounded-lg border border-gray-200 outline-none focus:border-primeColor duration-200 bg-gray-50" type="email" placeholder="ejemplo@correo.com" />
              {errEmail && <p className="text-xs text-red-500 font-medium mt-0.5">{errEmail}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-titleFont text-sm font-semibold text-gray-600">Contrasena</label>
              <input onChange={handlePassword} value={password} className="w-full h-11 placeholder:text-sm px-4 text-sm font-medium rounded-lg border border-gray-200 outline-none focus:border-primeColor duration-200 bg-gray-50" type="password" placeholder="Tu contrasena" />
              {errPassword && <p className="text-xs text-red-500 font-medium mt-0.5">{errPassword}</p>}
            </div>
            <button type="submit" disabled={loading} className="bg-primeColor hover:bg-black text-white cursor-pointer w-full text-sm font-semibold h-11 rounded-lg duration-300 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2">
              {loading ? "Ingresando..." : "Iniciar Sesion"}
            </button>
            <p className="text-sm text-center text-gray-500 mt-2">
              No tienes una cuenta?{" "}
              <Link to="/signup"><span className="text-primeColor font-semibold hover:underline duration-300">Registrate</span></Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
