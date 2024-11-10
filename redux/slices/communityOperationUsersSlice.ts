import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  closeModalAddCommunityOperationUser: boolean;
  closeModalEditCommunityOperationUser: boolean;
  addedCommunityOperationUser: Array<object>;
  addedUserProfile: object;
  addedCommunityOperationUserTracking: Array<object>;
  addedCommunityOperationUserEnrolling: Array<object>;
}

const initialState: IInitialState = {
  closeModalAddCommunityOperationUser: false,
  closeModalEditCommunityOperationUser: false,
  addedCommunityOperationUser: [],
  addedUserProfile: {},
  addedCommunityOperationUserTracking: [],
  addedCommunityOperationUserEnrolling: [],
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
    setAddedCommunityOperationUserTracking: (state, action) => {
      const addedCommunityOperationUserTracking = action.payload;
      return { ...state, addedCommunityOperationUserTracking };
    },
    setAddedCommunityOperationUserEnrolling: (state, action) => {
      const addedCommunityOperationUserEnrolling = action.payload;
      return { ...state, addedCommunityOperationUserEnrolling };
    },
  },
});

export const {
  setCloseModalAddCommunityOperationUser,
  setCloseModalEditCommunityOperationUser,
  setAddedCommunityOperationUser,
  setAddedUserProfile,
  setAddedCommunityOperationUserTracking,
  setAddedCommunityOperationUserEnrolling,
} = communityOperationUsersSlice.actions;

export default communityOperationUsersSlice.reducer;
