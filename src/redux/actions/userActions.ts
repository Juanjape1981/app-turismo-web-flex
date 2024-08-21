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
//Post para login de user
const userLogIn = (user: UserLogin | null, token: string) => {
  return async (dispatch: Dispatch) => {
    if (!user && token.length) {
      const decodedToken: CustomJwtPayload = await jwtDecode(token);
      // console.log("decodedToken en JWT", decodedToken);
      const userData: User = {
        user_id: 0, 
        first_name: '',
        last_name: '',
        country: '',
        city: '',
        birth_date: '',
        email: decodedToken.email,
        phone_number: '',
        gender: '',
        subscribed_to_newsletter: false,
        status: {id:1,name:'',description:''},
        token: token,
        image_url: '',
        exp: decodedToken.exp,
        roles: []
      };
      const res = dispatch(loginUser(userData));
      return res;
    } else if (user && !token.length) {
      try {
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
          roles:  response.data.user.roles
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
    console.log("respuesta de estados en action", response);
      
    dispatch(setStatuses(response.data));
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};
const updateUser = (userData: any) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { accessToken } = getState().user; // Obtener el token del estado global
console.log("userdata en la action", userData);
console.log("Token en la action", accessToken);
    try {
      const response = await axios.put(`${URL}/user/${userData.user_id}`, userData.data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // console.log(response);
      return response
      // fetchAllUsers()
    } catch (error) {
      console.error("Error updating user:", error);
      // Manejo de errores
    }
  };
};

// Acción para asignar un rol a un usuario
const assignRoleToUser = (data: { role_ids: number[]; user_id: number; }) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { accessToken } = getState().user;
    console.log(accessToken);
    
    try {
      const response = await axios.post(`${URL}/assign_roles_to_user`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}` // Agregar el token en el header
        }
      });
      // console.log(response);
      return response
      // Dispatch de la acción para manejar la asignación de roles en el estado
      // dispatch(assignRoleSuccess(response.data));
    } catch (error) {
      console.error("Error assigning role to user:", error);
      // Manejo de errores
    }
  };
};



export { userLogIn, logOutUser,resetPassword,fetchAllUsers, fetchRoles, fetchStatuses, updateUser, assignRoleToUser, createUser };
