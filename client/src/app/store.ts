import gameSlice from "@/slices/game-slice";
import lobbySlice from "@/slices/lobby-slice";
import UiSlice from "@/slices/ui-slice";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    lobby: lobbySlice,
    game: gameSlice,
    ui: UiSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
