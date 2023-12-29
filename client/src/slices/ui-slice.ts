import { RootState } from "@/app/store";
import { PurchasableTile } from "@backend/types/Board";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  toast: {
    variant: "default" | "destructive";
    title: string;
  } | null;
  gameLog: { id: number; message: string }[];
  selectedTile: PurchasableTile | null;
}

const initialState: UiState = {
  toast: null,
  gameLog: [],
  selectedTile: null,
};

export const gameSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    resetUi: () => {
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
    setSelectedTile: (state, action: PayloadAction<PurchasableTile>) => {
      state.selectedTile = action.payload;
    },
  },
});

export const { resetUi, showToast, setRoomUi, writeLog, setSelectedTile } =
  gameSlice.actions;

export const selectPurchasableTileIndex = (state: RootState) =>
  state.game.map.board.findIndex(
    (tile) => tile.name === state.ui.selectedTile?.name
  );

export default gameSlice.reducer;
