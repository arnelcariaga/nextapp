import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  closeModalAddSai: boolean
  closeModalEditSai: boolean
  //addedSais: Array<object>
}

const initialState: IInitialState = {
  closeModalAddSai: false,
  closeModalEditSai: false,
  //addedSais: []
};

export const saisSlice = createSlice({
  name: "sais",
  initialState,
  reducers: {
    setCloseModalAddSai: (state, action) => {
      const closeModalAddSai = action.payload;
      return { ...state, closeModalAddSai };
    },
    setCloseModalEditSai: (state, action) => {
      const closeModalEditSai = action.payload;
      return { ...state, closeModalEditSai };
    },
    // setAddedSais: (state, action) => {
    //   const sai = action.payload;
    //   return { ...state, addedSais: sai };
    // },
  },
});

export const { setCloseModalAddSai, setCloseModalEditSai } = saisSlice.actions;

export default saisSlice.reducer;
