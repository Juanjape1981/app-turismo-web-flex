import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Register.scss';
import { FieldError, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useState } from 'react';
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";

// Actualiza el modelo para reflejar los nuevos campos
interface UserRegister {
  email: string;
  password: string;
  confirmPassword?: string;
  first_name: string;
  last_name: string;
  country: string;
  city: string;
  phone_number?: string;
  gender?: string;
  otro_genero?: string; 
  birth_date?: string;
  subscribed_to_newsletter?: boolean;
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

    userData.email = userData.email.trim().toLowerCase();
    if (otro_genero) {
      userData.gender = otro_genero;
    }
    console.log("data a enviar",userData);
    // Enviar los datos al servidor con los nombres de campos correctos
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
                {...register("first_name", { required: "Nombre requerido" })}
              />
              {errors.first_name && (
                <span className="form-error">{(errors.first_name as FieldError).message}</span>
              )}
              <input
                type="text"
                placeholder="* Apellido"
                className="form-input"
                {...register("last_name", { required: "Apellido requerido" })}
              />
              {errors.last_name && (
                <span className="form-error">{(errors.last_name as FieldError).message}</span>
              )}
              <input
                type="text"
                placeholder="* País"
                className="form-input"
                {...register("country", { required: "País requerido" })}
              />
              {errors.country && (
                <span className="form-error">{(errors.country as FieldError).message}</span>
              )}
              <input
                type="text"
                placeholder="* Ciudad"
                className="form-input"
                {...register("city", { required: "Ciudad requerida" })}
              />
              {errors.city && (
                <span className="form-error">{(errors.city as FieldError).message}</span>
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
                {...register("phone_number")}
              />
              <select
                className="form-input"
                {...register("gender")}
                onChange={handleGeneroChange}
              >
                <option value="">Seleccione Género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
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
                {...register("birth_date")}
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
