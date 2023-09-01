import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  toast: {
    variant: "default" | "destructive";
    title: string;
  } | null;
  gameLog: { id: number; message: string }[];
  selectedTileIndex: number | null;
}

const initialState: UiState = {
  toast: null,
  gameLog: [],
  selectedTileIndex: null,
};

export const gameSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    resetUi: (state) => {
      return initialState;
    },
    showToast: (state, action: PayloadAction<UiState["toast"]>) => {
      state.toast = action.payload;
    },
    setRoomUi: (state, action: PayloadAction<string[]>) => {
      state.gameLog = action.payload.map((log, idx) => ({
        id: idx,
        message: log,
      }));
    },
    writeLog: (state, action: PayloadAction<string>) => {
      state.gameLog.unshift({
        id: state.gameLog.length + 1,
        message: action.payload,
      });
    },
    setSelectedTile: (state, action: PayloadAction<number>) => {
      state.selectedTileIndex = action.payload;
    },
  },
});

export const { resetUi, showToast, setRoomUi, writeLog, setSelectedTile } =
  gameSlice.actions;

export default gameSlice.reducer;
