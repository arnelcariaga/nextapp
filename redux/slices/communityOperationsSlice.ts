import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  closeModalEditCommunityOperation: boolean
  addedCommunityOperation: Array<object>
}

const initialState: IInitialState = {
  closeModalEditCommunityOperation: false,
  addedCommunityOperation: []
};

export const communityOperationsSlice = createSlice({
  name: "communityOperations",
  initialState,
  reducers: {
    setCloseModalEditCommunityOperation: (state, action) => {
      const closeModalEditCommunityOperation = action.payload;
      return { ...state, closeModalEditCommunityOperation };
    },
    setAddedCommunityOperation: (state, action) => {
      const communityOperation = action.payload;
      return { ...state, addedCommunityOperation: communityOperation };
    },
  },
});

export const { setCloseModalEditCommunityOperation, setAddedCommunityOperation } = communityOperationsSlice.actions;

export default communityOperationsSlice.reducer;
