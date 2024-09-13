import { configureStore } from "@reduxjs/toolkit";
import rolesSlice from "./slices/rolesSlice";

export const store = configureStore({
  reducer: {
    roles: rolesSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
