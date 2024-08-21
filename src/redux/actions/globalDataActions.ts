import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { setCategories, setCountries } from "../reducers/globalDataReducer";

const URL = import.meta.env.VITE_API_URL;

export const fetchCategories = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/categories`);
      console.log("respuesta de categorias", response);
      
      dispatch(setCategories(response.data));
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };
};

export const fetchCountries = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/countries`);
      dispatch(setCountries(response.data));
    } catch (error) {
      console.error("Error al obtener los países:", error);
    }
  };
};
