import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  closeModalAddRol: boolean
  closeModalEditRol: boolean
  addedRoles: Array<object>
}

const initialState: IInitialState = {
  closeModalAddRol: false,
  closeModalEditRol: false,
  addedRoles: []
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setCloseModalAddRol: (state, action) => {
      const closeModalAddRol = action.payload;
      return { ...state, closeModalAddRol };
    },
    setCloseModalEditRol: (state, action) => {
      const closeModalEditRol = action.payload;
      return { ...state, closeModalEditRol };
    },
    setAddedRoles: (state, action) => {
      const rol = action.payload;
      return { ...state, addedRoles: rol };
    },
  },
});

export const { setCloseModalAddRol, setAddedRoles, setCloseModalEditRol } = rolesSlice.actions;

export default rolesSlice.reducer;
