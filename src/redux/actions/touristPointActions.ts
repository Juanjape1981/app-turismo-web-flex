import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setAllTouristPoints,
  setSelectedTouristPoint,
  addTouristPoint,
  updateTouristPoint,
  deleteTouristPoint
} from "../reducers/touristPointsReducer";
import { TouristPointCreate } from "../../models/TouristPoint";


const URL = import.meta.env.VITE_API_URL;

// Obtener todos los puntos turísticos
const fetchAllTouristPoints = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/tourist_points`);
      dispatch(setAllTouristPoints(response.data));
    } catch (error) {
      console.error("Error al obtener todos los puntos turísticos:", error);
    }
  };
};

// Obtener un punto turístico por ID
const fetchTouristPointById = (touristPointId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/tourist_points/${touristPointId}`);
      dispatch(setSelectedTouristPoint(response.data));
    } catch (error) {
      console.error(`Error al obtener el punto turístico ${touristPointId}:`, error);
    }
  };
};

// Crear un nuevo punto turístico
const createTouristPoint = (touristPointData: TouristPointCreate) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}/tourist_points`, touristPointData);
      dispatch(addTouristPoint(response.data));
      return response
    } catch (error) {
      console.error("Error al crear un nuevo punto turístico:", error);
    }
  };
};

// Actualizar un punto turístico existente
const updateTouristPointById = (touristPointId: string, touristPointData: TouristPointCreate, deletedImages: number[]) => {
  return async (dispatch: Dispatch) => {
    try {
        // Eliminar las imágenes
      if (deletedImages.length > 0) {
        const responseDel = await axios.post(`${URL}/tourist_points/${touristPointId}/images/delete`, { image_ids: deletedImages });
            console.log("respuesta de la eliminacion de imagenes",responseDel);
            
      }
      const response = await axios.put(`${URL}/tourist_points/${touristPointId}`, touristPointData);
      console.log("respuesta de la actualizacion",response);
      dispatch(updateTouristPoint(response.data));
      return response
    } catch (error) {
      console.error(`Error al actualizar el punto turístico ${touristPointId}:`, error);
    }
  };
};

// Eliminar un punto turístico
const deleteTouristPointById = (touristPointId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      await axios.delete(`${URL}/tourist_points/${touristPointId}`);
      dispatch(deleteTouristPoint(touristPointId));
    } catch (error) {
      console.error(`Error al eliminar el punto turístico ${touristPointId}:`, error);
    }
  };
};

export {
  fetchAllTouristPoints,
  fetchTouristPointById,
  createTouristPoint,
  updateTouristPointById,
  deleteTouristPointById,
};
