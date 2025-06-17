import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import transactionReducer from "./slices/transactionSlice";
import categoryReducer from "./slices/categorySlice";
import goalReducer from "./slices/goalSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
    goals: goalReducer,
  },
});

export default store;
