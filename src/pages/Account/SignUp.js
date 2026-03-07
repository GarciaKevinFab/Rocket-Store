import React, { useState, useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { logo } from "../../assets/images";
import { useAuth } from "../../context/AuthContext";
import { peruDepartments } from "../../constants/paymentConfig";
import { linkGuestOrdersToUser } from "../../services/orderService";
import toast from "react-hot-toast";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [district, setDistrict] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [errCity, setErrCity] = useState("");
  const [errDepartment, setErrDepartment] = useState("");
  const [errDistrict, setErrDistrict] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const isPostPurchase = searchParams.has("email");

  useEffect(() => {
    const paramEmail = searchParams.get("email");
    const paramName = searchParams.get("name");
    const paramPhone = searchParams.get("phone");
    if (paramEmail) setEmail(paramEmail);
    if (paramName) setClientName(paramName);
    if (paramPhone) setPhone(paramPhone);
  }, [searchParams]);

  const EmailValidation = (email) => String(email).toLowerCase().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!checked) return;

    let hasError = false;
    if (!clientName) { setErrClientName("Ingrese su nombre completo"); hasError = true; }
    if (!email) { setErrEmail("Ingrese su correo electronico"); hasError = true; }
    else if (!EmailValidation(email)) { setErrEmail("Ingrese un correo valido"); hasError = true; }
    if (!phone) { setErrPhone("Ingrese su numero de telefono"); hasError = true; }
    if (!password) { setErrPassword("Cree una contrasena"); hasError = true; }
    else if (password.length < 6) { setErrPassword("Minimo 6 caracteres"); hasError = true; }
    if (!address) { setErrAddress("Ingrese su direccion"); hasError = true; }
    if (!city) { setErrCity("Ingrese su ciudad"); hasError = true; }
    if (!department) { setErrDepartment("Seleccione su departamento"); hasError = true; }
    if (!district) { setErrDistrict("Ingrese su distrito"); hasError = true; }
    if (hasError) return;

    setLoading(true);
    try {
      const cred = await signup(email, password, { displayName: clientName, phone, address, city, department, district });

      if (isPostPurchase) {
        try {
          const linked = await linkGuestOrdersToUser(email, cred.user.uid);
          if (linked > 0) {
            toast.success(`Cuenta creada! ${linked} pedido(s) vinculado(s) a tu cuenta.`);
          } else {
            toast.success("Cuenta creada exitosamente!");
          }
        } catch (linkError) {
          toast.success("Cuenta creada exitosamente!");
        }
      } else {
        toast.success("Cuenta creada exitosamente!");
      }

      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") setErrEmail("Este correo ya esta registrado");
      else setErrEmail("Error al crear la cuenta");
    }
    setLoading(false);
  };

  const inputClass = "w-full h-11 placeholder:text-sm px-4 text-sm font-medium rounded-lg border border-gray-200 outline-none focus:border-primeColor duration-200 bg-gray-50";

  return (
    <div className="w-full min-h-screen flex flex-col lgl:flex-row items-center justify-start">
      {/* Left Side */}
      <div className="w-full lgl:w-1/2 hidden lgl:inline-flex h-screen text-white">
        <div className="w-full max-w-[450px] h-full bg-gradient-to-b from-primeColor to-gray-800 px-10 flex flex-col gap-6 justify-center">
          <Link to="/"><img src={logo} alt="logoImg" className="w-28" /></Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Crea tu cuenta gratis</h1>
            <p className="text-sm text-gray-300">Acceso completo a RUME IMPORT</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-400 mt-1"><BsCheckCircleFill /></span>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-semibold font-titleFont">Comienza rapido con RUME IMPORT</span><br />
              Registro facil, simple con pasos sencillos.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-400 mt-1"><BsCheckCircleFill /></span>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-semibold font-titleFont">Accede a todos los servicios</span><br />
              Descuentos exclusivos, ofertas de temporada unicas.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-400 mt-1"><BsCheckCircleFill /></span>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-white font-semibold font-titleFont">Nuestros clientes confian en nosotros</span><br />
              Productos 100% originales importados.
            </p>
          </div>
          <div className="flex items-center gap-6 mt-10">
            <Link to="/"><p className="text-xs font-titleFont text-gray-400 hover:text-white cursor-pointer duration-300">&copy; RUME IMPORT</p></Link>
            <p className="text-xs font-titleFont text-gray-400 hover:text-white cursor-pointer duration-300">Terminos</p>
            <p className="text-xs font-titleFont text-gray-400 hover:text-white cursor-pointer duration-300">Privacidad</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lgl:w-1/2 flex flex-col justify-center items-center px-6 py-8 lgl:py-0">
        <form onSubmit={handleSignUp} className="w-full max-w-[480px] flex flex-col justify-center">
          <div className="w-full max-h-[90vh] flex flex-col justify-start overflow-y-auto scrollbar-thin scrollbar-thumb-primeColor">
            {isPostPurchase && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800 font-medium">Crea tu cuenta para rastrear tus pedidos y comprar mas rapido</p>
                <p className="text-xs text-green-600 mt-0.5">Tus pedidos como invitado se vincularan automaticamente.</p>
              </div>
            )}
            <h1 className="font-titleFont font-bold text-2xl md:text-3xl mb-2 text-primeColor">Crear tu cuenta</h1>
            <p className="text-sm text-gray-400 mb-6">Completa tus datos para registrarte</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-titleFont text-sm font-semibold text-gray-600">Nombre completo</label>
                <input onChange={(e) => { setClientName(e.target.value); setErrClientName(""); }} value={clientName} className={inputClass} type="text" placeholder="Ej: Juan Perez" />
                {errClientName && <p className="text-xs text-red-500 font-medium">{errClientName}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-titleFont text-sm font-semibold text-gray-600">Correo Electronico</label>
                <input onChange={(e) => { setEmail(e.target.value); setErrEmail(""); }} value={email} className={inputClass} type="email" placeholder="ejemplo@correo.com" />
                {errEmail && <p className="text-xs text-red-500 font-medium">{errEmail}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-titleFont text-sm font-semibold text-gray-600">Telefono</label>
                <input onChange={(e) => { setPhone(e.target.value); setErrPhone(""); }} value={phone} className={inputClass} type="text" placeholder="987 654 321" />
                {errPhone && <p className="text-xs text-red-500 font-medium">{errPhone}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-titleFont text-sm font-semibold text-gray-600">Contrasena</label>
                <input onChange={(e) => { setPassword(e.target.value); setErrPassword(""); }} value={password} className={inputClass} type="password" placeholder="Minimo 6 caracteres" />
                {errPassword && <p className="text-xs text-red-500 font-medium">{errPassword}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-titleFont text-sm font-semibold text-gray-600">Direccion</label>
                <input onChange={(e) => { setAddress(e.target.value); setErrAddress(""); }} value={address} className={inputClass} type="text" placeholder="Av. Arequipa 123" />
                {errAddress && <p className="text-xs text-red-500 font-medium">{errAddress}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-titleFont text-sm font-semibold text-gray-600">Departamento</label>
                  <select onChange={(e) => { setDepartment(e.target.value); setErrDepartment(""); }} value={department} className={`${inputClass} cursor-pointer`}>
                    <option value="">Seleccionar</option>
                    {peruDepartments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                  {errDepartment && <p className="text-xs text-red-500 font-medium">{errDepartment}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-titleFont text-sm font-semibold text-gray-600">Ciudad</label>
                  <input onChange={(e) => { setCity(e.target.value); setErrCity(""); }} value={city} className={inputClass} type="text" placeholder="Lima" />
                  {errCity && <p className="text-xs text-red-500 font-medium">{errCity}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-titleFont text-sm font-semibold text-gray-600">Distrito</label>
                <input onChange={(e) => { setDistrict(e.target.value); setErrDistrict(""); }} value={district} className={inputClass} type="text" placeholder="Miraflores" />
                {errDistrict && <p className="text-xs text-red-500 font-medium">{errDistrict}</p>}
              </div>
              <div className="flex items-start gap-2.5 mt-1">
                <input onChange={() => setChecked(!checked)} className="w-4 h-4 mt-0.5 cursor-pointer accent-primeColor" type="checkbox" />
                <p className="text-sm text-gray-500">Estoy de acuerdo con RUME IMPORT{" "}
                  <span className="text-primeColor font-medium hover:underline cursor-pointer">Terminos de servicio</span> y{" "}
                  <span className="text-primeColor font-medium hover:underline cursor-pointer">Politica de Privacidad</span>.
                </p>
              </div>
              <button type="submit" disabled={!checked || loading} className={`${checked ? "bg-primeColor hover:bg-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5" : "bg-gray-300 cursor-not-allowed"} w-full text-white text-sm font-semibold h-11 rounded-lg duration-300 mt-1`}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
              <p className="text-sm text-center text-gray-500 mt-1 pb-4">
                Ya tienes una cuenta?{" "}
                <Link to="/signin"><span className="text-primeColor font-semibold hover:underline duration-300">Iniciar sesion</span></Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
