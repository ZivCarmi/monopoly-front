import { RootState } from "@/app/store";
import { TradePlayer, TradeStatus, TradeType } from "@backend/types/Game";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TradeState {
  tradeId: string | null;
  inTrade: boolean;
  status: TradeStatus;
  isPublished: boolean;
  offeror: TradePlayer | null;
  offeree: TradePlayer | null;
  tradesQueue: TradeType[];
}

const initialState: TradeState = {
  tradeId: null,
  inTrade: false,
  status: "idle",
  isPublished: false,
  offeror: null,
  offeree: null,
  tradesQueue: [],
};

export const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    resetTrades: () => {
      return initialState;
    },
    setInTrade: (state, action: PayloadAction<boolean>) => {
      state.inTrade = action.payload;
    },
    resetTrade: (state) => {
      state.tradeId = null;
      state.inTrade = false;
      state.status = "idle";
      state.isPublished = false;
      state.offeror = null;
      state.offeree = null;
    },
    setTradeId: (state, action: PayloadAction<string>) => {
      state.tradeId = action.payload;
    },
    setTrade: (state, action: PayloadAction<TradeType>) => {
      const { id, offeror, offeree } = action.payload;

      state.tradeId = id;
      state.offeror = offeror;
      state.offeree = offeree;
    },
    setPublished: (state) => {
      state.isPublished = true;
    },
    updateTrade: (state, action: PayloadAction<TradeType>) => {
      const { offeror, offeree } = action.payload;

      state.offeror = offeror;
      state.offeree = offeree;
    },
    setPlayerMoney: (
      state,
      action: PayloadAction<{ playerId: string; amount: number }>
    ) => {
      const { playerId, amount } = action.payload;

      if (state.offeror?.id === playerId) {
        state.offeror.money = amount;
      } else if (state.offeree?.id === playerId) {
        state.offeree.money = amount;
      }
    },
    setPlayerProperties: (
      state,
      action: PayloadAction<{ playerId: string; tileIndex: number }>
    ) => {
      const { playerId, tileIndex } = action.payload;

      if (state.offeror?.id === playerId) {
        const existTileIndex = state.offeror.properties.findIndex(
          (tileIdx) => tileIdx === tileIndex
        );

        if (existTileIndex === -1) {
          state.offeror.properties.push(tileIndex);
        } else {
          state.offeror.properties.splice(existTileIndex, 1);
        }
      } else if (state.offeree?.id === playerId) {
        const existTileIndex = state.offeree.properties.findIndex(
          (tileIdx) => tileIdx === tileIndex
        );

        if (existTileIndex === -1) {
          state.offeree.properties.push(tileIndex);
        } else {
          state.offeree.properties.splice(existTileIndex, 1);
        }
      }
    },
    setTradeStatus: (state, action: PayloadAction<TradeStatus>) => {
      state.status = action.payload;
    },
    addTradeToQueue: (state, action: PayloadAction<TradeType>) => {
      state.tradesQueue = [...state.tradesQueue, action.payload];
    },
    updateTradeInQueue: (state, action: PayloadAction<TradeType>) => {
      const trade = action.payload;
      const tradeIndexInQueue = state.tradesQueue.findIndex(
        (_trade) => _trade.id === trade.id
      );

      state.tradesQueue[tradeIndexInQueue] = trade;
    },
    removeTradeFromQueue: (
      state,
      action: PayloadAction<{ tradeId: string }>
    ) => {
      state.tradesQueue = state.tradesQueue.filter(
        (trade) => trade.id !== action.payload.tradeId
      );
    },
  },
});

export const {
  resetTrades,
  setInTrade,
  resetTrade,
  setTradeId,
  setTrade,
  setPublished,
  updateTrade,
  setPlayerMoney,
  setPlayerProperties,
  setTradeStatus,
  addTradeToQueue,
  updateTradeInQueue,
  removeTradeFromQueue,
} = tradeSlice.actions;

export const selectTrade = (state: RootState, tradeId: string) =>
  state.trade.tradesQueue.find((trade) => trade.id === tradeId);
export const selectOfferorPlayer = (state: RootState) =>
  state.game.players.find((player) => player.id === state.trade.offeror?.id);
export const selectOffereePlayer = (state: RootState) =>
  state.game.players.find((player) => player.id === state.trade.offeree?.id);

export default tradeSlice.reducer;
