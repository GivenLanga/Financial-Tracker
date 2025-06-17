import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {
    setCategories: (state, action) => action.payload,
    addCategory: (state, action) => {
      state.push(action.payload);
    },
    deleteCategory: (state, action) => {
      return state.filter((c) => c._id !== action.payload);
    },
  },
});

export const { setCategories, addCategory, deleteCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
