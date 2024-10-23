import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  closeModalAddCommunityOperationUser: boolean;
  closeModalEditCommunityOperationUser: boolean;
  addedCommunityOperationUser: Array<object>;
  addedUserProfile: object;
}

const initialState: IInitialState = {
  closeModalAddCommunityOperationUser: false,
  closeModalEditCommunityOperationUser: false,
  addedCommunityOperationUser: [],
  addedUserProfile: {},
};

export const communityOperationUsersSlice = createSlice({
  name: "communityOperationUsers",
  initialState,
  reducers: {
    setCloseModalAddCommunityOperationUser: (state, action) => {
      const closeModalAddCommunityOperationUser = action.payload;
      return { ...state, closeModalAddCommunityOperationUser };
    },
    setCloseModalEditCommunityOperationUser: (state, action) => {
      const closeModalEditCommunityOperationUser = action.payload;
      return { ...state, closeModalEditCommunityOperationUser };
    },
    setAddedCommunityOperationUser: (state, action) => {
      const communityOperationUser = action.payload;
      return { ...state, addedCommunityOperationUser: communityOperationUser };
    },
    setAddedUserProfile: (state, action) => {
      const data = action.payload;
      return { ...state, addedUserProfile: data };
    },
  },
});

export const {
  setCloseModalAddCommunityOperationUser,
  setCloseModalEditCommunityOperationUser,
  setAddedCommunityOperationUser,
  setAddedUserProfile,
} = communityOperationUsersSlice.actions;

export default communityOperationUsersSlice.reducer;
