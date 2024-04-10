import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Select the slice state
const selectGameSlice = (state: RootState) => state.game;

// Define the memoized selector
export const selectPlayersExceptSelf = createSelector(
  selectGameSlice,
  (gameSlice) => {
    // Your selector logic here
    return gameSlice.players.filter(
      (player) => player.id !== gameSlice.selfPlayer?.id
    );
  }
);
