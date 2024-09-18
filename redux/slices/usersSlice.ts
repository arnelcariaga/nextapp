import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  closeModalAddUser: boolean
  closeModalEditUser: boolean
  addedUsers: Array<object>
}

const initialState: IInitialState = {
  closeModalAddUser: false,
  closeModalEditUser: false,
  addedUsers: []
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCloseModalAddUser: (state, action) => {
      const closeModalAddUser = action.payload;
      return { ...state, closeModalAddUser };
    },
    setCloseModalEditUser: (state, action) => {
      const closeModalEditUser = action.payload;
      return { ...state, closeModalEditUser };
    },
    setAddedUsers: (state, action) => {
      const user = action.payload;
      return { ...state, addedUsers: user };
    },
  },
});

export const { setCloseModalAddUser, setAddedUsers, setCloseModalEditUser } = usersSlice.actions;

export default usersSlice.reducer;
