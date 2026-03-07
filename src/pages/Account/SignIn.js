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
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/"><img src={logo} alt="logoImg" className="w-28" /></Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Mantente registrado para mas</h1>
            <p className="text-base">Cuando inicias sesion, estas con nosotros!</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Comienza rapido con RUME IMPORT</span><br />
              Registro facil, simple con pasos sencillos. Empieza a comprar ahora.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Accede a todos los servicios de RUME IMPORT</span><br />
              Descuentos exclusivos para miembros, productos importados, ofertas unicas.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Nuestros clientes confian en nosotros</span><br />
              Productos 100% originales. Gracias por tu preferencia.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/"><p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">&copy; RUME IMPORT</p></Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Terminos</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Privacidad</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Seguridad</p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full flex items-center justify-center px-4">
        <form onSubmit={handleSignIn} className="w-full max-w-[450px] flex flex-col justify-center">
          <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">Iniciar sesion</h1>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-.5">
              <p className="font-titleFont text-base font-semibold text-gray-600">Correo Electronico</p>
              <input onChange={handleEmail} value={email} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="email" placeholder="ejemplo@correo.com" />
              {errEmail && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errEmail}</p>}
            </div>
            <div className="flex flex-col gap-.5">
              <p className="font-titleFont text-base font-semibold text-gray-600">Contrasena</p>
              <input onChange={handlePassword} value={password} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="password" placeholder="Tu contrasena" />
              {errPassword && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errPassword}</p>}
            </div>
            <button type="submit" disabled={loading} className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300 disabled:opacity-50">
              {loading ? "Ingresando..." : "Iniciar Sesion"}
            </button>
            <p className="text-sm text-center font-titleFont font-medium">
              No tienes una cuenta?{" "}
              <Link to="/signup"><span className="hover:text-blue-600 duration-300">Registrate</span></Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
