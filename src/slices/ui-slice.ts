import { RootState } from "@/app/store";
import { PurchasableTile } from "@ziv-carmi/monopoly-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameLogType = { id: number; message: string; date: Date };

export interface UiState {
  gameLog: GameLogType[];
  selectedTile: PurchasableTile | null;
}

const initialState: UiState = {
  gameLog: [],
  selectedTile: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    resetUi: () => {
      return initialState;
    },
    writeLog: (state, action: PayloadAction<string>) => {
      state.gameLog.unshift({
        id: state.gameLog.length + 1,
        message: action.payload,
        date: new Date(),
      });
    },
    setSelectedTile: (state, action: PayloadAction<PurchasableTile>) => {
      state.selectedTile = action.payload;
    },
  },
});

export const { resetUi, writeLog, setSelectedTile } = uiSlice.actions;

export const selectPurchasableTileIndex = (state: RootState) =>
  state.game.map.board.findIndex(
    (tile) => tile.name === state.ui.selectedTile?.name
  );

export default uiSlice.reducer;
