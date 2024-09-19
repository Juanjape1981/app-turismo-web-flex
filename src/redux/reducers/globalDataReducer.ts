import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalDataState {
  categories: any[]; 
  countries: any[]; 
}

 const initialState: GlobalDataState = {
  categories: [],
  countries: [],
};

 const globalDataSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<any[]>) {
      state.categories = action.payload;
    },
    setCountries(state, action: PayloadAction<any[]>) {
      state.countries = action.payload;
    },
  },
});

export const { setCategories, setCountries } = globalDataSlice.actions;

export default globalDataSlice.reducer;
