import gameSlice from "@/slices/game-slice";
import lobbySlice from "@/slices/lobby-slice";
import tradeSlice from "@/slices/trade-slice";
import uiSlice from "@/slices/ui-slice";
import userSlice from "@/slices/user-slice";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    user: userSlice,
    lobby: lobbySlice,
    game: gameSlice,
    ui: uiSlice,
    trade: tradeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
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
