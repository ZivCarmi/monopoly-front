import { AppThunk } from "@/app/store";
import {
  completeTrade,
  freePlayer,
  purchaseProperty,
  sellProperty,
  setCityLevel,
  transferMoney,
} from "@/slices/game-slice";
import {
  resetTrade,
  setInTrade,
  setPublished,
  setTrade,
  setTradeStatus,
  updateTrade,
  addTradeToQueue,
  removeTradeFromQueue,
  updateTradeInQueue,
} from "@/slices/trade-slice";
import { setSelectedTile, writeLog } from "@/slices/ui-slice";
import { getPlayerName } from "@/utils";
import {
  PAY_OUT_FROM_JAIL_AMOUNT,
  IProperty,
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
        `${playerName} שילם $${PAY_OUT_FROM_JAIL_AMOUNT} עבור שחרור מהכלא`
      )
    );
  };
};

export const tradeCreatedThunk = (trade: TradeType): AppThunk => {
  return (dispatch, getState) => {
    dispatch(addTradeToQueue(trade));

    // if offeree is the socket
    if (trade.offeree.id === getState().game.selfPlayer?.id) {
      dispatch(setPublished());
      dispatch(setInTrade(true));
      dispatch(setTrade(trade));
      dispatch(setTradeStatus("recieved"));
    }
  };
};

export const tradeAcceptedThunk = (tradeId: string): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const trade = state.trade.tradesQueue.find((trade) => trade.id === tradeId);
    const { selfPlayer } = state.game;

    if (!trade) {
      throw new Error("Trade not found on tradeAcceptedThunk");
    }

    if (!selfPlayer) return;

    const offerorName = getPlayerName(trade.offeror.id);
    const offereeName = getPlayerName(trade.offeree.id);
    const isSelfTraded = [trade.offeror.id, trade.offeree.id].some(
      (tradedPlayerId) => tradedPlayerId === selfPlayer.id
    );

    dispatch(completeTrade(trade));
    dispatch(removeTradeFromQueue({ tradeId }));
    dispatch(writeLog(`${offerorName} ביצע עסקה עם ${offereeName}`));
    if (isSelfTraded) {
      dispatch(resetTrade());
    }
  };
};

export const tradeDeclinedThunk = ({
  tradeId,
}: {
  tradeId: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const trade = state.trade.tradesQueue.find((trade) => trade.id === tradeId);
    const { selfPlayer } = state.game;

    if (!trade) {
      throw new Error("Trade not found on tradeDeclinedThunk");
    }

    if (!selfPlayer) return;

    dispatch(removeTradeFromQueue({ tradeId }));

    // reset trade for traded players
    if (
      trade.offeror.id === selfPlayer.id ||
      trade.offeree.id === selfPlayer.id
    ) {
      dispatch(resetTrade());
    }
  };
};

export const tradeUpdatedThunk = (trade: TradeType): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const tradeInQueue = state.trade.tradesQueue.find(
      (_trade) => _trade.id === trade.id
    );

    if (!tradeInQueue) {
      throw new Error("Trade not found on tradeUpdatedThunk");
    }

    dispatch(updateTradeInQueue(trade));

    if (trade.turn === getState().game.selfPlayer?.id) {
      dispatch(updateTrade(trade));
      dispatch(setTradeStatus("recieved"));
    }
  };
};
