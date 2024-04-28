import { AppThunk } from "@/app/store";
import {
  addTrade,
  completeTrade,
  freePlayer,
  purchaseProperty,
  removeTrade,
  sellProperty,
  setCityLevel,
  transferMoney,
  updateTrade,
} from "@/slices/game-slice";
import {
  resetTrade,
  setMode,
  setTrade,
  setTradeIsOpen,
} from "@/slices/trade-slice";
import { setSelectedTile, writeLog } from "@/slices/ui-slice";
import { getPlayerName } from "@/utils";
import {
  IProperty,
  PAY_OUT_FROM_JAIL_AMOUNT,
  PurchasableTile,
  TradeType,
  getCityLevelText,
} from "@ziv-carmi/monopoly-utils";

export const purchasedPropertyThunk = (propertyIndex: number): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { currentPlayerTurnId } = state.game;
    const { selectedTile } = state.ui;

    if (!currentPlayerTurnId) return;

    const playerName = getPlayerName(currentPlayerTurnId);
    const tile = getState().game.map.board[propertyIndex];

    dispatch(purchaseProperty({ propertyIndex }));
    dispatch(writeLog(`${playerName} רכש את ${tile.name}`));

    if (selectedTile) {
      dispatch(
        setSelectedTile(
          getState().game.map.board[propertyIndex] as PurchasableTile
        )
      );
    }
  };
};

export const soldPropertyThunk = (propertyIndex: number): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { currentPlayerTurnId } = state.game;
    const { selectedTile } = state.ui;

    if (!currentPlayerTurnId) return;

    const playerName = getPlayerName(currentPlayerTurnId);
    const tile = getState().game.map.board[propertyIndex];

    dispatch(sellProperty({ propertyIndex }));
    dispatch(writeLog(`${playerName} מכר את ${tile.name}`));

    if (selectedTile) {
      dispatch(
        setSelectedTile(
          getState().game.map.board[propertyIndex] as PurchasableTile
        )
      );
    }
  };
};

export const cityLevelChangedThunk = ({
  propertyIndex,
  changeType,
}: {
  propertyIndex: number;
  changeType: "upgrade" | "downgrade";
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { currentPlayerTurnId } = state.game;
    const { selectedTile } = state.ui;

    if (!currentPlayerTurnId) return;

    const playerName = getPlayerName(currentPlayerTurnId);
    const tile = state.game.map.board[propertyIndex] as IProperty;

    let cityLevelText = getCityLevelText(tile.rentIndex + 1);
    let message = `${playerName} שדרג ל${cityLevelText} ב${tile.name}`;

    if (changeType === "downgrade") {
      cityLevelText = getCityLevelText(tile.rentIndex - 1);
      message = `${playerName} שנמך ל${cityLevelText} ב${tile.name}`;
    }

    dispatch(setCityLevel({ propertyIndex, changeType }));
    dispatch(writeLog(message));

    if (selectedTile) {
      dispatch(
        setSelectedTile(getState().game.map.board[propertyIndex] as IProperty)
      );
    }
  };
};

export const paidOutOfJailThunk = (): AppThunk => {
  return (dispatch, getState) => {
    const { currentPlayerTurnId } = getState().game;

    if (!currentPlayerTurnId) {
      throw new Error("currentPlayerTurnId not found in paidOutOfJailThunk");
    }

    const playerName = getPlayerName(currentPlayerTurnId);

    dispatch(
      transferMoney({
        payerId: currentPlayerTurnId,
        amount: PAY_OUT_FROM_JAIL_AMOUNT,
      })
    );
    dispatch(freePlayer({ playerId: currentPlayerTurnId }));
    dispatch(
      writeLog(
        `${playerName} שילם ₪${PAY_OUT_FROM_JAIL_AMOUNT} עבור שחרור מהכלא`
      )
    );
  };
};

export const tradeCreatedThunk = (trade: TradeType): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(addTrade(trade));

    // if offeree is the socket
    if (trade.turn === state.game.selfPlayer?.id) {
      if (!state.trade.tradeIsOpen && !state.trade.selectPlayerIsOpen) {
        dispatch(setTradeIsOpen(true));
        dispatch(setTrade(trade));
        dispatch(setMode("watching"));
      }
    }
  };
};

export const tradeAcceptedThunk = (tradeId: string): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const trade = state.game.trades.find((trade) => trade.id === tradeId);
    const isStaleTrade = state.trade.trade?.id === tradeId;

    if (!trade) {
      throw new Error("Trade not found on tradeAcceptedThunk");
    }

    const offerorName = getPlayerName(trade.lastEditBy);
    const offereeName = getPlayerName(trade.turn);

    dispatch(completeTrade(trade));
    dispatch(removeTrade({ tradeId }));
    dispatch(writeLog(`${offerorName} ביצע עסקה עם ${offereeName}`));

    if (isStaleTrade) {
      dispatch(resetTrade());
    }
  };
};

export const tradeDeclinedThunk = (tradeId: string): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const trade = state.game.trades.find((trade) => trade.id === tradeId);
    const isStaleTrade = state.trade.trade?.id === tradeId;

    if (!trade) {
      throw new Error("Trade not found on tradeDeclinedThunk");
    }

    const declinerName = getPlayerName(trade.turn);
    const otherPlayerName = getPlayerName(trade.lastEditBy);

    dispatch(removeTrade({ tradeId }));
    dispatch(writeLog(`${declinerName} ביטל עסקה עם ${otherPlayerName}`));

    if (isStaleTrade) {
      dispatch(resetTrade());
    }
  };
};

export const tradeUpdatedThunk = (trade: TradeType): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(updateTrade(trade));

    if (trade.turn === state.game.selfPlayer?.id) {
      if (!state.trade.tradeIsOpen && !state.trade.selectPlayerIsOpen) {
        dispatch(setTradeIsOpen(true));
        dispatch(setTrade(trade));
        dispatch(setMode("watching"));
      }
    }
  };
};

export const tradeDeletedThunk = (tradeId: string): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const trade = state.game.trades.find((trade) => trade.id === tradeId);
    const isStaleTrade = state.trade.trade?.id === tradeId;

    if (!trade) {
      throw new Error("Trade not found on tradeDeletedThunk");
    }

    const deleterName = getPlayerName(trade.lastEditBy);
    const otherPlayerName = getPlayerName(trade.turn);

    dispatch(removeTrade({ tradeId }));
    dispatch(writeLog(`${deleterName} ביטל עסקה עם ${otherPlayerName}`));

    if (isStaleTrade) {
      dispatch(resetTrade());
    }
  };
};
