import { FieldError, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import '../styles/pages/Login.scss';
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useAppDispatch } from "../redux/store/hooks";
import { userLogIn } from "../redux/actions/userActions";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { useState } from "react";
import Loader from "../components/Loader/Loader";
import User from "../models/User";
// import fondo from '../assets/images/fondoondas.svg'

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    color: "#0F0C06",
    width: "400px",
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      email: data.email.trim().toLowerCase(),
    };
  
    setLoading(true);
  
    try {
      const resp: Error | { payload: User; type: "user/loginUser"; } | undefined = await dispatch(userLogIn(formattedData, ""));

      setLoading(false);
      console.log("respuesta del dispatch. tiene payload?",resp);
      
      if (resp && "payload" in resp){
        Cookies.set("data",resp?.payload?.token, { expires: 3 });
        Toast.fire({
          icon: "success",
          title: `Bienvenido ${data.email}`,
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        throw resp;
      }
    } catch (error: any) {
      setLoading(false);
  
      if (error.message === "Usuario no autorizado") {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "Usuario no autorizado para acceder a esta aplicación.",
          width: "32rem",
          padding: "0.5rem",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Usuario o contraseña incorrectos`,
          width: "22rem",
          padding: "0.5rem",
        }).then(() => {
          location.href = "/login";
        });
      }
    }
  };
  const handleCancel = () => {
    navigate("/");
  };
  
  return (
    <div className="login-container">
      {loading && <Loader />}
      <div className="content">
        <div className="form-container">
          <div className="logo">
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="logoCapitanDiv">
                <Link className="logoCapitan" to="/">
                  <img className="logo" src={logo} alt="logo" />
                  <img className="logo2" src={logo2} alt="logo2" />
                </Link>
              </div>
              <input
                type="email"
                placeholder="Correo Eléctronico"
                className="form-input"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Correo requerido",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Correo no valido",
                  },
                })}
              />
              {errors.email && (
                <span className="form-error"> {(errors.email as FieldError).message}</span>
              )}
              <input
                type="password"
                placeholder="Contraseña"
                className="form-input"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Ingresar contraseña por favor",
                  },
                })}
              />
              {errors.password && (
                <span className="form-error"> {(errors.password as FieldError).message}</span>
              )}
              <button type="submit" className="submit_button">Ingresar</button>
              <button type="button" className="cancel-buttonLog" onClick={handleCancel}>Cancelar</button>
              {/* <Link to="/register" className="create-account-button">Crear cuenta</Link> */}
            </form>
      {/* <img src={fondo} alt="" className="fondoOlas"/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
