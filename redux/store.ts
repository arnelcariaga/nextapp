import { configureStore } from "@reduxjs/toolkit";
import rolesSlice from "./slices/rolesSlice";
import usersSlice from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    roles: rolesSlice,
    users: usersSlice
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
