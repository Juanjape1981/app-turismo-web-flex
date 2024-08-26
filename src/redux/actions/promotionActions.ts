import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setAllPromotions,
  setBranchPromotions,
  setSelectedPromotion,
  addPromotion,
  updatePromotion
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
const createPromotion = (promotionData: Promotion) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}//promotions`, promotionData);
      console.log("respuesta de la creacion", promotionData);
      
      dispatch(addPromotion(response.data));
    } catch (error) {
      console.error("Error al crear una nueva promoción:", error);
    }
  };
};

// Actualizar una promoción existente
const updatePromotionById = (promotionId: number, promotionData: Promotion, deletedImageIds: number[]) => {
  return async (dispatch: Dispatch) => {
    const imgDelete = {'image_ids': deletedImageIds}
    try {
      if(deletedImageIds.length){
        const responseDeleted= await axios.delete(`${URL}/promotion_images`,  { data: imgDelete } );
      console.log(responseDeleted);}
      
      const responseUpdate = await axios.put(`${URL}/promotions/${promotionId}`, promotionData);
      // console.log("respuesta de la actualizacion",responseUpdate.data);
      
      dispatch(updatePromotion(responseUpdate.data));
    } catch (error) {
      console.error(`Error al actualizar la promoción ${promotionId}:`, error);
    }
  };
};

// Eliminar una promoción ----- Borrado lógico ------
const deletePromotionById = (promotionId: number, status: any) => {
  console.log("status en action",status);
  
  return async (dispatch: Dispatch) => {
    try {

      const responseUpdate = await axios.put(`${URL}/promotions/${promotionId}`, {status_id:status[0].id});
      // console.log("respuesta de la eliminacion",responseUpdate);
      
      dispatch(updatePromotion(responseUpdate.data));
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
