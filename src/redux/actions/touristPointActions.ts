import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setAllTouristPoints,
  setSelectedTouristPoint,
  addTouristPoint,
  updateTouristPoint,
  deleteTouristPoint
} from "../reducers/touristPointsReducer";
import { TouristPoint } from "../../models/TouristPoint";


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
const createTouristPoint = (touristPointData: TouristPoint) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}/tourist_points`, touristPointData);
      dispatch(addTouristPoint(response.data));
    } catch (error) {
      console.error("Error al crear un nuevo punto turístico:", error);
    }
  };
};

// Actualizar un punto turístico existente
const updateTouristPointById = (touristPointId: number, touristPointData: TouristPoint) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put(`${URL}/tourist_points/${touristPointId}`, touristPointData);
      dispatch(updateTouristPoint(response.data));
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
