import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Register.scss';
import { FieldError, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useState } from 'react';
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";

interface UserRegister {
  email: string;
  password: string;
  confirmPassword?: string;
  nombre: string;
  apellido: string;
  pais: string;
  ciudad: string;
  nro_telefono?: string;
  sexo?: string;
  otro_genero?: string; 
  fecha_nacimiento?: string;
  suscrito_newsletter?: boolean;
  categories?: number[];
}

const Register = () => {
  const URL = import.meta.env.VITE_API_URL;
  const { handleSubmit, register, watch, formState: { errors } } = useForm<UserRegister>();
  const navigate = useNavigate();
  const [showOtroGenero, setShowOtroGenero] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const onSubmit = (data: UserRegister) => {
    const { confirmPassword, otro_genero, ...userData } = data;
    if (otro_genero) {
      userData.sexo = otro_genero;
    }
    axios.post(`${URL}/signup`, userData).then((resp: any) => {
      Toast.fire({
        icon: "success",
        title: `${resp.data.message}`,
      }).then(() => {
        navigate("/login");
      });
    }).catch((error) => {
      console.log(error);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error durante el registro.",
        width: "20rem",
        padding: "0.5rem",
      });
    });
  };

  const handleGeneroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShowOtroGenero(e.target.value === 'Otro');
  };

  return (
    <div className="register-container">
      <div className="content">
        <div className="form-container">
          <h3>Súmate a nuestra comunidad:</h3>
          <div className="divLogoReg">
            <Link className="divLogoReg2" to="/">
              <img className="logoregister" src={logo} alt="logoregister" />
              <img className="logo2register" src={logo2} alt="logo2register" />
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-grid">
              <input
                type="text"
                placeholder="* Nombre"
                className="form-input"
                {...register("nombre", { required: "Nombre requerido" })}
              />
              {errors.nombre && (
                <span className="form-error">{(errors.nombre as FieldError).message}</span>
              )}
              <input
                type="text"
                placeholder="* Apellido"
                className="form-input"
                {...register("apellido", { required: "Apellido requerido" })}
              />
              {errors.apellido && (
                <span className="form-error">{(errors.apellido as FieldError).message}</span>
              )}
              <input
                type="text"
                placeholder="* País"
                className="form-input"
                {...register("pais", { required: "País requerido" })}
              />
              {errors.pais && (
                <span className="form-error">{(errors.pais as FieldError).message}</span>
              )}
              <input
                type="text"
                placeholder="* Ciudad"
                className="form-input"
                {...register("ciudad", { required: "Ciudad requerida" })}
              />
              {errors.ciudad && (
                <span className="form-error">{(errors.ciudad as FieldError).message}</span>
              )}
              <input
                type="email"
                placeholder="* Correo electrónico"
                className="form-input"
                {...register("email", {
                  required: "Correo electrónico requerido",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Correo electrónico no válido",
                  },
                })}
              />
              {errors.email && (
                <span className="form-error">{(errors.email as FieldError).message}</span>
              )}
              <input
                type="text"
                placeholder="Número de Teléfono"
                className="form-input"
                {...register("nro_telefono")}
              />
              <select
                className="form-input"
                {...register("sexo")}
                onChange={handleGeneroChange}
              >
                <option value="">Seleccione Género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {showOtroGenero && (
                <input
                  type="text"
                  placeholder="Especificar género si lo desea"
                  className="form-input"
                  {...register("otro_genero", { required: "Especificar género si lo desea." })}
                />
              )}
              <input
                type="date"
                className="form-input"
                {...register("fecha_nacimiento")}
              />
            </div>
            <div className="password-divider">
              <input
                type="password"
                placeholder="* Contraseña"
                className="form-input"
                {...register("password", { required: "Contraseña requerida" })}
              />
              {errors.password && (
                <span className="form-error">{(errors.password as FieldError).message}</span>
              )}
              <input
                type="password"
                placeholder="* Confirmar contraseña"
                className="form-input"
                {...register("confirmPassword", {
                  required: "Confirmar contraseña requerida",
                  validate: value => value === watch("password") || "Las contraseñas no coinciden"
                })}
              />
              {errors.confirmPassword && (
                <span className="form-error">{(errors.confirmPassword as FieldError).message}</span>
              )}
            </div>
            {/* <label className="form-checkbox">
              <input
                type="checkbox"
                {...register("suscrito_newsletter")}
              />
              Suscrito a Newsletter
            </label> */}
            <button type="submit" className="submit-button">Registrar</button>
            <p>* datos obligatorios para registrarse</p>
            <Link to="/login" className="already-account-button">Si ya tienes cuenta, ingresa aquí</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
