import socketSlice from "@/slices/user-slice";
import gameSlice from "@/slices/game-slice";
import lobbySlice from "@/slices/lobby-slice";
import uiSlice from "@/slices/ui-slice";
import tradeSlice from "@/slices/trade-slice";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    user: socketSlice,
    lobby: lobbySlice,
    game: gameSlice,
    ui: uiSlice,
    trade: tradeSlice,
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
