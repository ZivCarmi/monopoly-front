import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  volume: number;
}

const initialState: UiState = {
  volume: 1,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
});

export const { setVolume } = uiSlice.actions;

export default uiSlice.reducer;
