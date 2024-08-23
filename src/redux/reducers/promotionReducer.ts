import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Promotion } from "../../models/PromotionModel";

export interface PromotionState {
    allPromotions: Promotion[];
    branchPromotions: Promotion[];
    selectedPromotion: Promotion | null;
}

const initialState: PromotionState = {
    allPromotions: [],
    branchPromotions: [],
    selectedPromotion: null,
};

const promotionSlice = createSlice({
    name: 'promotions',
    initialState,
    reducers: {
        setAllPromotions: (state, action: PayloadAction<Promotion[]>) => {
            state.allPromotions = action.payload;
        },
        setBranchPromotions: (state, action: PayloadAction<Promotion[]>) => {
            state.branchPromotions = action.payload;
        },
        setSelectedPromotion: (state, action: PayloadAction<Promotion | null>) => {
            state.selectedPromotion = action.payload;
        },
        addPromotion: (state, action: PayloadAction<Promotion>) => {
            state.allPromotions.push(action.payload);
            state.branchPromotions.push(action.payload);
        },
        updatePromotion: (state, action: PayloadAction<Partial<Promotion>>) => {
            const indexAll = state.allPromotions.findIndex(promo => promo.promotion_id === action.payload.promotion_id);
            if (indexAll >= 0) {
                // Combina los datos existentes con los nuevos datos proporcionados
                state.allPromotions[indexAll] = {
                    ...state.allPromotions[indexAll],
                    ...action.payload,
                };
            }
            const indexBranch = state.branchPromotions.findIndex(promo => promo.promotion_id === action.payload.promotion_id);
            if (indexBranch >= 0) {
                // Combina los datos existentes con los nuevos datos proporcionados
                state.branchPromotions[indexBranch] = {
                    ...state.branchPromotions[indexBranch],
                    ...action.payload,
                };
            }
        },
        deletePromotion: (state, action: PayloadAction<number>) => {
            state.allPromotions = state.allPromotions.filter(promo => promo.promotion_id !== action.payload);
            state.branchPromotions = state.branchPromotions.filter(promo => promo.promotion_id !== action.payload);
            if (state.selectedPromotion?.promotion_id === action.payload) state.selectedPromotion = null;
        },
    }
});

export const {
    setAllPromotions,
    setBranchPromotions,
    setSelectedPromotion,
    addPromotion,
    updatePromotion,
    deletePromotion
} = promotionSlice.actions;

export default promotionSlice.reducer;
