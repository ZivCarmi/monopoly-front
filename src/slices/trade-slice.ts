import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TradeType } from "@ziv-carmi/monopoly-utils";

export type TradeMode = "creating" | "watching" | "editing" | "idle";

export interface TradeState {
  tradeIsOpen: boolean;
  selectPlayerIsOpen: boolean;
  mode: TradeMode;
  trade: TradeType | null;
}

const initialState: TradeState = {
  tradeIsOpen: false,
  selectPlayerIsOpen: false,
  mode: "idle",
  trade: null,
};

export const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    resetTrade: () => {
      return initialState;
    },
    setTradeIsOpen: (state, action: PayloadAction<boolean>) => {
      state.tradeIsOpen = action.payload;
    },
    setSelectPlayerIsOpen: (state, action: PayloadAction<boolean>) => {
      state.selectPlayerIsOpen = action.payload;
    },
    setMode: (state, action: PayloadAction<TradeMode>) => {
      state.mode = action.payload;
    },
    setTrade: (state, action: PayloadAction<TradeType>) => {
      state.trade = action.payload;
    },
    setPlayerMoney: (
      state,
      action: PayloadAction<{ traderId: string; amount: number }>
    ) => {
      const { traderId, amount } = action.payload;

      if (state.trade) {
        const traderIndex = state.trade.traders.findIndex(
          (trader) => trader.id === traderId
        );

        if (traderIndex !== -1) {
          state.trade.traders[traderIndex].money = amount;
        }
      }
    },
    setPlayerProperties: (
      state,
      action: PayloadAction<{ traderId: string; tileIndex: number }>
    ) => {
      const { traderId, tileIndex } = action.payload;

      if (state.trade) {
        const traderIndex = state.trade.traders.findIndex(
          (trader) => trader.id === traderId
        );

        if (traderIndex !== -1) {
          const trader = state.trade.traders[traderIndex];
          const existTileIndex = trader.properties.findIndex(
            (tileIdx) => tileIdx === tileIndex
          );

          if (existTileIndex === -1) {
            state.trade.traders[traderIndex].properties.push(tileIndex);
          } else {
            const filteredProperties = state.trade.traders[
              traderIndex
            ].properties.filter((propIdx) => propIdx !== tileIndex);

            state.trade.traders[traderIndex].properties = filteredProperties;
          }
        }
      }
    },
  },
});

export const {
  resetTrade,
  setTradeIsOpen,
  setSelectPlayerIsOpen,
  setMode,
  setTrade,
  setPlayerMoney,
  setPlayerProperties,
} = tradeSlice.actions;

export default tradeSlice.reducer;
