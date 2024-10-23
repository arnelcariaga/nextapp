import { configureStore } from "@reduxjs/toolkit";
import rolesSlice from "./slices/rolesSlice";
import usersSlice from "./slices/usersSlice";
import saisSlice from "./slices/saisSlice";
import communityOperationsSlice from "./slices/communityOperationsSlice";
import communityOperationUsersSlice from "./slices/communityOperationUsersSlice";
import appSettingsSlice from "./slices/appSettingsSlice";

export const store = configureStore({
  reducer: {
    roles: rolesSlice,
    users: usersSlice,
    sais: saisSlice,
    communityOperations: communityOperationsSlice,
    communityOperationUsers: communityOperationUsersSlice,
    appSettings: appSettingsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
