import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Thunk to fetch all transactions from backend
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, thunkAPI) => {
    const res = await axiosInstance.get("/api/transactions");
    return res.data;
  }
);

// Use an object for initialState to support loading/loaded/items
const initialState = {
  items: [],
  loading: false,
  loaded: false,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.items = action.payload;
      state.loaded = true;
    },
    addTransaction: (state, action) => {
      state.items.push(action.payload);
    },
    updateTransaction: (state, action) => {
      const idx = state.items.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.loaded = true;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.loading = false;
        state.loaded = false;
      });
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = transactionSlice.actions;
export default transactionSlice.reducer;
