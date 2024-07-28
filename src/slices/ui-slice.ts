import { RootState } from "@/app/store";
import {
  isPurchasable,
  PardonCard,
  PurchasableTile,
} from "@ziv-carmi/monopoly-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameLogType = { id: number; message: string; date: Date };

export interface UiState {
  gameLog: GameLogType[];
  selectedTile: PurchasableTile | PardonCard | null;
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
    setSelectedTile: (
      state,
      action: PayloadAction<PurchasableTile | PardonCard>
    ) => {
      state.selectedTile = action.payload;
    },
  },
});

export const { resetUi, writeLog, setSelectedTile } = uiSlice.actions;

export const selectSelectedTileIndex = (state: RootState) =>
  state.game.map.board.findIndex(
    (tile) =>
      state.ui.selectedTile &&
      isPurchasable(state.ui.selectedTile) &&
      tile.name === state.ui.selectedTile.name
  );

export default uiSlice.reducer;
