import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transactions",
  initialState: [],
  reducers: {
    setTransactions: (state, action) => action.payload,
    addTransaction: (state, action) => {
      state.push(action.payload);
    },
    updateTransaction: (state, action) => {
      const idx = state.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteTransaction: (state, action) => {
      return state.filter((t) => t._id !== action.payload);
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = transactionSlice.actions;
export default transactionSlice.reducer;
