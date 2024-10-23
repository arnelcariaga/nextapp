import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  isSidebarOpen: boolean;
}

const initialState: IInitialState = {
  isSidebarOpen: false,
};

export const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setIsSidebarOpen: (state) => {
      return { isSidebarOpen: !state.isSidebarOpen };
    },
  },
});

export const { setIsSidebarOpen } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
