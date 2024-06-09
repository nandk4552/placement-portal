import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

// Create the store using configureStore, which automatically applies middleware and enables Redux DevTools
const store = configureStore({
  reducer: {
    rootReducer,
  },
});

export default store;
