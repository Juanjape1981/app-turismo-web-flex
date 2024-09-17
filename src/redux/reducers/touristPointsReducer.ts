import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TouristPoint } from "../../models/TouristPoint";

export interface TouristPointState {
    allTouristPoints: TouristPoint[];
    selectedTouristPoint: TouristPoint | null;
}

const initialState: TouristPointState = {
    allTouristPoints: [],
    selectedTouristPoint: null,
};

const touristPointSlice = createSlice({
    name: 'touristPoints',
    initialState,
    reducers: {
        setAllTouristPoints: (state, action: PayloadAction<TouristPoint[]>) => {
            state.allTouristPoints = action.payload;
        },
        setSelectedTouristPoint: (state, action: PayloadAction<TouristPoint | null>) => {
            state.selectedTouristPoint = action.payload;
        },
        addTouristPoint: (state, action: PayloadAction<TouristPoint>) => {
            state.allTouristPoints.push(action.payload);
        },
        updateTouristPoint: (state, action: PayloadAction<Partial<TouristPoint>>) => {
            const index = state.allTouristPoints.findIndex((point:any) => point.id === action.payload.id);
            if (index >= 0) {
                // Combina los datos existentes con los nuevos datos proporcionados
                state.allTouristPoints[index] = {
                    ...state.allTouristPoints[index],
                    ...action.payload,
                };
            }
        },
        deleteTouristPoint: (state, action: PayloadAction<number>) => {
            state.allTouristPoints = state.allTouristPoints.filter((point:any) => point.id !== action.payload);
            if (state.selectedTouristPoint?.id === action.payload) state.selectedTouristPoint = null;
        },
    }
});

export const {
    setAllTouristPoints,
    setSelectedTouristPoint,
    addTouristPoint,
    updateTouristPoint,
    deleteTouristPoint
} = touristPointSlice.actions;

export default touristPointSlice.reducer;
