import { Dispatch } from "@reduxjs/toolkit";
import UserLogin from "../../models/UserLogin";
import { logOut, loginUser } from "../reducers/userReducer";
import axios from "axios";
import User from "../../models/User";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

interface CustomJwtPayload extends JwtPayload {
  public_id: string;
  email: string;
  exp: number;
}

//Post para login de user
const userLogIn = (user: UserLogin | null, token: string) => {
  return async (dispatch: Dispatch) => {
    if (!user && token.length) {
      const decodedToken: CustomJwtPayload = await jwtDecode(token);

      console.log("decodedToken en JWT",decodedToken);
      
      const userData: User = {
        id: 0,
        public_id: decodedToken.public_id,
        nombre: '',
        apellido: '',
        pais: '',
        ciudad: '',
        fecha_nacimiento: '',
        email: decodedToken.email,
        nro_telefono: '',
        sexo: '',
        suscrito_newsletter: false,
        estado: '',
        role: '',
        categories: [],
        token: token,
        exp: decodedToken.exp
      };
      const res = dispatch(loginUser(userData));
      return res;
    } else if (user && !token.length) {
      try {
        const URL = import.meta.env.VITE_API_URL;
        const response = await axios.post(`${URL}/login`, user);
        const decodedToken: CustomJwtPayload = await jwtDecode(response.data.token);

        const userData: User = {
          id: response.data.user.id,
          public_id: response.data.user.public_id,
          nombre: response.data.user.nombre,
          apellido: response.data.user.apellido,
          pais: response.data.user.pais,
          ciudad: response.data.user.ciudad,
          fecha_nacimiento: response.data.user.fecha_nacimiento,
          email: response.data.user.email,
          nro_telefono: response.data.user.nro_telefono,
          sexo: response.data.user.sexo,
          suscrito_newsletter: response.data.user.suscrito_newsletter,
          estado: response.data.user.estado,
          role: response.data.user.role,
          categories: response.data.user.categories,
          token: response.data.token,
          exp: decodedToken.exp
        };

        Cookies.set("data", response.data.token, { expires: 3 });
        const res = dispatch(loginUser(userData));
        return res;
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
      }
    }
  };
};

const logOutUser = () => {
  return async (dispatch: Dispatch) => {
    try {
      if (Cookies.get('data')) {
        Cookies.remove('data', { path: '/auth' });
        Cookies.remove('data', { path: '/' });
        window.location.reload();
      } else {
        console.log("La cookie 'userData' no existe.");
      }
      dispatch(logOut({}));
    } catch (error) {
      console.error(error);
    }
  };
};

export {
  userLogIn, logOutUser
};
