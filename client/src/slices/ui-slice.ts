import { GameTile } from "@backend/types/Board";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  toast: {
    variant: "default" | "destructive";
    title: string;
  } | null;
  gameLog: { id: number; message: string }[];
  selectedTilePos: GameTile | undefined;
  highlightProperties: boolean;
}

const initialState: UiState = {
  toast: null,
  gameLog: [],
  selectedTilePos: undefined,
  highlightProperties: false,
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
    setSelectedTile: (state, action: PayloadAction<GameTile>) => {
      state.selectedTilePos = action.payload;
    },
    setHighlightProperties: (state) => {
      state.highlightProperties = !state.highlightProperties;
    },
  },
});

export const {
  resetUi,
  showToast,
  setRoomUi,
  writeLog,
  setSelectedTile,
  setHighlightProperties,
} = gameSlice.actions;

export default gameSlice.reducer;
