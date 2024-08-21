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
        updatePromotion: (state, action: PayloadAction<Promotion>) => {
            const indexAll = state.allPromotions.findIndex(promo => promo.id === action.payload.id);
            if (indexAll >= 0) state.allPromotions[indexAll] = action.payload;

            const indexBranch = state.branchPromotions.findIndex(promo => promo.id === action.payload.id);
            if (indexBranch >= 0) state.branchPromotions[indexBranch] = action.payload;
        },
        deletePromotion: (state, action: PayloadAction<number>) => {
            state.allPromotions = state.allPromotions.filter(promo => promo.id !== action.payload);
            state.branchPromotions = state.branchPromotions.filter(promo => promo.id !== action.payload);
            if (state.selectedPromotion?.id === action.payload) state.selectedPromotion = null;
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
