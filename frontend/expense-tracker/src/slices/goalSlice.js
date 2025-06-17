import { createSlice } from "@reduxjs/toolkit";

const goalSlice = createSlice({
  name: "goals",
  initialState: [],
  reducers: {
    setGoals: (state, action) => action.payload,
    addGoal: (state, action) => {
      state.push(action.payload);
    },
    updateGoal: (state, action) => {
      const idx = state.findIndex((g) => g._id === action.payload._id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteGoal: (state, action) => {
      return state.filter((g) => g._id !== action.payload);
    },
  },
});

export const { setGoals, addGoal, updateGoal, deleteGoal } = goalSlice.actions;
export default goalSlice.reducer;
