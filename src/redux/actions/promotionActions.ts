import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setAllPromotions,
  setBranchPromotions,
  setSelectedPromotion,
  addPromotion,
  updatePromotion,
  deletePromotion
} from "../reducers/promotionReducer";
import { Promotion } from "../../models/PromotionModel";

const URL = import.meta.env.VITE_API_URL;

// Obtener todas las promociones
const fetchAllPromotions = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/promotions`);
      dispatch(setAllPromotions(response.data));
    } catch (error) {
      console.error("Error al obtener todas las promociones:", error);
    }
  };
};

// Obtener promociones de un branch específico
const fetchBranchPromotions = (branchId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/branches/${branchId}/promotions`);
      dispatch(setBranchPromotions(response.data));
    } catch (error) {
      console.error(`Error al obtener las promociones del branch ${branchId}:`, error);
    }
  };
};

// Obtener una promoción por ID
const fetchPromotionById = (promotionId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/promotions/${promotionId}`);
      dispatch(setSelectedPromotion(response.data));
    } catch (error) {
      console.error(`Error al obtener la promoción ${promotionId}:`, error);
    }
  };
};

// Crear una nueva promoción
const createPromotion = (branchId: number, promotionData: Promotion) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}/branches/${branchId}/promotions`, promotionData);
      dispatch(addPromotion(response.data));
    } catch (error) {
      console.error("Error al crear una nueva promoción:", error);
    }
  };
};

// Actualizar una promoción existente
const updatePromotionById = (promotionId: number, promotionData: Promotion) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put(`${URL}/promotions/${promotionId}`, promotionData);
      dispatch(updatePromotion(response.data));
    } catch (error) {
      console.error(`Error al actualizar la promoción ${promotionId}:`, error);
    }
  };
};

// Eliminar una promoción
const deletePromotionById = (promotionId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      await axios.delete(`${URL}/promotions/${promotionId}`);
      dispatch(deletePromotion(promotionId));
    } catch (error) {
      console.error(`Error al eliminar la promoción ${promotionId}:`, error);
    }
  };
};

export {
  fetchAllPromotions,
  fetchBranchPromotions,
  fetchPromotionById,
  createPromotion,
  updatePromotionById,
  deletePromotionById,
};
