import { CreateTradeArgs } from "@/types/Trade";
import { generateTrade } from "@/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PardonCard, TradeType } from "@ziv-carmi/monopoly-utils";

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
    setSelectPlayerIsOpen: (state, action: PayloadAction<boolean>) => {
      state.selectPlayerIsOpen = action.payload;
    },
    createTrade: (state, action: PayloadAction<CreateTradeArgs>) => {
      const newTrade = generateTrade(action.payload);

      state.selectPlayerIsOpen = false;
      state.trade = newTrade;
      state.mode = "creating";
      state.tradeIsOpen = true;
    },
    watchTrade: (state, action: PayloadAction<TradeType>) => {
      state.selectPlayerIsOpen = false;
      state.trade = action.payload;
      state.mode = "watching";
      state.tradeIsOpen = true;
    },
    editTrade: (state) => {
      state.mode = "editing";
    },
    toggleTrade: (state, action: PayloadAction<boolean>) => {
      state.tradeIsOpen = action.payload;
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
    setPlayerPardonCard: (
      state,
      action: PayloadAction<{ traderId: string; pardonCard: PardonCard }>
    ) => {
      const { traderId, pardonCard } = action.payload;

      if (state.trade) {
        const traderIndex = state.trade.traders.findIndex(
          (trader) => trader.id === traderId
        );

        if (traderIndex !== -1) {
          const trader = state.trade.traders[traderIndex];
          const existPardonCard = trader.pardonCards.findIndex(
            ({ deck }) => deck === pardonCard.deck
          );

          if (existPardonCard === -1) {
            state.trade.traders[traderIndex].pardonCards.push(pardonCard);
          } else {
            const filteredPardonCards = trader.pardonCards.filter(
              ({ deck }) => deck !== pardonCard.deck
            );

            state.trade.traders[traderIndex].pardonCards = filteredPardonCards;
          }
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
            const filteredProperties = trader.properties.filter(
              (propIdx) => propIdx !== tileIndex
            );

            state.trade.traders[traderIndex].properties = filteredProperties;
          }
        }
      }
    },
    removePlayerProperties: (
      state,
      action: PayloadAction<{ traderId: string; tileIndexesToRemove: number[] }>
    ) => {
      const { traderId, tileIndexesToRemove } = action.payload;

      if (state.trade) {
        const traderIndex = state.trade.traders.findIndex(
          (trader) => trader.id === traderId
        );

        if (traderIndex !== -1) {
          const trader = state.trade.traders[traderIndex];

          const updatedProperties = trader.properties.filter(
            (propIdx) => !tileIndexesToRemove.includes(propIdx)
          );

          state.trade.traders[traderIndex].properties = updatedProperties;
        }
      }
    },
  },
});

export const {
  resetTrade,
  setSelectPlayerIsOpen,
  createTrade,
  watchTrade,
  editTrade,
  toggleTrade,
  setPlayerMoney,
  setPlayerPardonCard,
  setPlayerProperties,
  removePlayerProperties,
} = tradeSlice.actions;

export default tradeSlice.reducer;
