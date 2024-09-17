import { Dispatch } from "@reduxjs/toolkit";
import UserLogin from "../../models/UserLogin";
import { logOut, loginUser, setRoles, setStatuses, setUsers } from "../reducers/userReducer";
import axios from "axios";
import User from "../../models/User";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { RootState } from "../store/store";
import Status from "../types/types";
import { Role } from "../../models/RoleModel";

interface CustomJwtPayload extends JwtPayload {
  public_id: string;
  email: string;
  exp: number;
}
interface CreateUserModel {
  password: string,
  first_name: string,
  last_name: string,
  country: string,
  email: string,
  status_id: number,
  city: string,
  birth_date: string,
  phone_number: string,
  gender: string,
  subscribed_to_newsletter: boolean,
  // image_url: string
}
const URL = import.meta.env.VITE_API_URL;

const userLogIn = (user: UserLogin | null, token: string) => {
  return async (dispatch: Dispatch) => {
    try {
      
      
      if (!user && token.length) {
        console.log("se envia token_____ user log",token);
        const response = await axios.get(`${URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("respuesta de se envia token____");
        
        const decodedToken: CustomJwtPayload = await jwtDecode(token);

        const userData: User = {
          user_id: response.data.user_id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          country: response.data.country,
          city: response.data.city,
          birth_date: response.data.birth_date,
          email: response.data.email,
          phone_number: response.data.phone_number,
          gender: response.data.gender,
          subscribed_to_newsletter: response.data.subscribed_to_newsletter,
          status: response.data.status,
          token: token,
          image_url: response.data.image_url,
          exp: decodedToken.exp,
          roles: response.data.roles, // Obtenemos los roles del response
        };

        
        const isAdmin = userData.roles.some(role => role.role_name === 'admin');

        if (!isAdmin) {
         return new Error("Usuario no autorizado");
        }


        Cookies.set("data", token, { expires: 3 });
        // Despachamos la acción de loginUser
        const res = dispatch(loginUser(userData));
        return res;

      // Si tenemos usuario pero no token, autenticamos con las credenciales
      } else if (user && !token.length) {
        const response = await axios.post(`${URL}/login`, user);
        const decodedToken: CustomJwtPayload = await jwtDecode(response.data.token);

        const userData: User = {
          user_id: response.data.user.user_id,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          country: response.data.user.country,
          city: response.data.user.city,
          birth_date: response.data.user.birth_date,
          email: response.data.user.email,
          phone_number: response.data.user.phone_number,
          gender: response.data.user.gender,
          subscribed_to_newsletter: response.data.user.subscribed_to_newsletter,
          status: response.data.user.status,
          token: response.data.token,
          image_url: response.data.user.image_url,
          exp: decodedToken.exp,
          roles: response.data.user.roles,
        };

        // Verificamos si el rol es 'admin'
        const isAdmin = userData.roles.some(role => role.role_name === 'admin');

        if (!isAdmin) {
          // Si no es admin, devolvemos un error
          return Error("Usuario no autorizado");
        }

        // Guardamos el token en las cookies si es admin
        Cookies.set("data", response.data.token, { expires: 3 });
        // Despachamos la acción de loginUser
        const res = dispatch(loginUser(userData));
        return res;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error; // Devolvemos el error para que sea manejado en el componente
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
const resetPassword = (data: { email: string; code: string; password: string }) => {
  return async (dispatch: Dispatch) => {
      try {
        console.log(dispatch);
        
          const response = await axios.put(`${URL}/reset_password/new_password`, data);
          // Handle successful response
          return response.data;
      } catch (error: any) {
          // Handle error
          throw new Error(error.response?.data?.message || 'An error occurred');
      }
  };
};
// Crear un nuevo usuario
const createUser = (userData: CreateUserModel) => {
  return async () => {
    try {
      const response = await axios.post(`${URL}/signup`, userData);
      // dispatch(setUsers(response.data));
      // console.log("respuesta del registro", response);
      
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo usuario:", error);
      throw error;
    }
  };
};
//crear asociado
// Crear un nuevo usuario
const createPartnerUser = (userData: CreateUserModel) => {
  return async () => {
    try {
      const response = await axios.post(`${URL}/signup-partner`, userData);
      // dispatch(setUsers(response.data));
      console.log("respuesta del registro", response);
      
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo usuario:", error);
      throw error;
    }
  };
};

const fetchAllUsers = () => async (dispatch: Dispatch, getState: () => RootState) => {
  const { accessToken } = getState().user; // Obtener el token del estado global

  try {
      const response = await axios.get<User[]>(`${URL}/users`, {
          headers: {
              Authorization: `Bearer ${accessToken}` // Agregar el token en el header
          }
      });
      console.log("respuesta en la action",response);
      
      dispatch(setUsers(response.data));
  } catch (error) {
      console.error("Error fetching users:", error);
      // Manejo de errores
  }
};
const fetchRoles = () => async (dispatch: Dispatch, getState: () => RootState) => {
  const { accessToken } = getState().user; // Obtener el token del estado global

  try {
    const response = await axios.get<Role[]>(`${URL}/roles`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    dispatch(setRoles(response.data));
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
};

const fetchStatuses = () => async (dispatch: Dispatch, getState: () => RootState) => {
  const { accessToken } = getState().user; 

  try {
    const response = await axios.get<Status[]>(`${URL}/statuses`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log("respuesta de estados en", response);
      
    dispatch(setStatuses(response.data));
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};
const updateUser = (userData: any) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { accessToken } = getState().user;
    try {
      const response = await axios.put(`${URL}/user/${userData.user_id}`, userData.data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      dispatch({ type: 'UPDATE_USER_SUCCESS', payload: response.data });
      return response;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
};

const assignRoleToUser = (data: { role_ids: number[]; user_id: number; }) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { accessToken } = getState().user;
    try {
      const response = await axios.post(`${URL}/assign_roles_to_user`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      dispatch({ type: 'ASSIGN_ROLE_SUCCESS', payload: response.data });
      return response;
    } catch (error) {
      console.error("Error assigning role to user:", error);
    }
  };
};



export { userLogIn, logOutUser,resetPassword,fetchAllUsers, fetchRoles, fetchStatuses, updateUser, assignRoleToUser, createUser, createPartnerUser };
