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

  // Pre-fill from query params (post-purchase guest)
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

      // Link guest orders to the new account
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

  return (
    <div className="w-full min-h-screen flex flex-col lgl:flex-row items-center justify-start">
      <div className="w-full lgl:w-1/2 hidden lgl:inline-flex h-screen text-white">
        <div className="w-full max-w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/"><img src={logo} alt="logoImg" className="w-28" /></Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Puedes iniciar gratis</h1>
            <p className="text-base">Crea tu cuenta para un acceso completo</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300"><span className="text-white font-semibold font-titleFont">Comienza rapido con RUME IMPORT</span><br />Registro facil, simple con pasos sencillos.</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300"><span className="text-white font-semibold font-titleFont">Accede a todos los servicios</span><br />Descuentos exclusivos, ofertas de temporada unicas.</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300"><span className="text-white font-semibold font-titleFont">Nuestros clientes confian en nosotros</span><br />Productos 100% originales importados.</p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">&copy; RUME IMPORT</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Terminos</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Privacidad</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Seguridad</p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 flex flex-col justify-center items-center px-4 py-6 lgl:py-0">
        <form onSubmit={handleSignUp} className="w-full max-w-[500px] flex flex-col justify-center">
          <div className="w-full max-h-[90vh] flex flex-col justify-start overflow-y-auto scrollbar-thin scrollbar-thumb-primeColor">
            {isPostPurchase && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <p className="text-sm text-green-800 font-medium">Crea tu cuenta para rastrear tus pedidos y comprar mas rapido</p>
                <p className="text-xs text-green-600">Tus pedidos como invitado se vincularan automaticamente.</p>
              </div>
            )}
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">Crear tu cuenta</h1>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">Nombre completo</p>
                <input onChange={(e) => { setClientName(e.target.value); setErrClientName(""); }} value={clientName} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="text" placeholder="Ej: Juan Perez" />
                {errClientName && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errClientName}</p>}
              </div>
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">Correo Electronico</p>
                <input onChange={(e) => { setEmail(e.target.value); setErrEmail(""); }} value={email} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="email" placeholder="ejemplo@correo.com" />
                {errEmail && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errEmail}</p>}
              </div>
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">Telefono</p>
                <input onChange={(e) => { setPhone(e.target.value); setErrPhone(""); }} value={phone} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="text" placeholder="987 654 321" />
                {errPhone && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errPhone}</p>}
              </div>
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">Contrasena</p>
                <input onChange={(e) => { setPassword(e.target.value); setErrPassword(""); }} value={password} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="password" placeholder="Minimo 6 caracteres" />
                {errPassword && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errPassword}</p>}
              </div>
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">Direccion</p>
                <input onChange={(e) => { setAddress(e.target.value); setErrAddress(""); }} value={address} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="text" placeholder="Av. Arequipa 123" />
                {errAddress && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errAddress}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">Departamento</p>
                  <select onChange={(e) => { setDepartment(e.target.value); setErrDepartment(""); }} value={department} className="w-full h-10 px-2 text-sm font-medium rounded-md border-[1px] border-gray-400 outline-none bg-white">
                    <option value="">Seleccionar</option>
                    {peruDepartments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                  {errDepartment && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errDepartment}</p>}
                </div>
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">Ciudad</p>
                  <input onChange={(e) => { setCity(e.target.value); setErrCity(""); }} value={city} className="w-full h-10 placeholder:text-sm px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="text" placeholder="Lima" />
                  {errCity && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errCity}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">Distrito</p>
                <input onChange={(e) => { setDistrict(e.target.value); setErrDistrict(""); }} value={district} className="w-full h-10 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none" type="text" placeholder="Miraflores" />
                {errDistrict && <p className="text-sm text-red-500 font-titleFont font-semibold px-4"><span className="font-bold italic mr-1">!</span>{errDistrict}</p>}
              </div>
              <div className="flex items-start mdl:items-center gap-2">
                <input onChange={() => setChecked(!checked)} className="w-4 h-4 mt-1 mdl:mt-0 cursor-pointer" type="checkbox" />
                <p className="text-sm text-primeColor">Estoy de acuerdo con RUME IMPORT <span className="text-blue-500">Terminos de servicio</span> y <span className="text-blue-500">Politica de Privacidad</span>.</p>
              </div>
              <button type="submit" disabled={!checked || loading} className={`${checked ? "bg-primeColor hover:bg-black hover:text-white cursor-pointer" : "bg-gray-500 cursor-not-allowed"} w-full text-gray-200 text-base font-medium h-10 rounded-md duration-300 disabled:opacity-50`}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
              <p className="text-sm text-center font-titleFont font-medium pb-4">
                Ya tienes una cuenta?{" "}<Link to="/signin"><span className="hover:text-blue-600 duration-300">Iniciar sesion</span></Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
