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
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constants";
import { IProperty, PurchasableTile } from "@backend/types/Board";
import { TradeType } from "@backend/types/Game";

export const purchasedPropertyThunk = ({
  propertyIndex,
  message,
}: {
  propertyIndex: number;
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedTile } = state.ui;

    dispatch(purchaseProperty({ propertyIndex }));

    dispatch(writeLog(message));

    if (selectedTile) {
      dispatch(
        setSelectedTile(
          getState().game.map.board[propertyIndex] as PurchasableTile
        )
      );
    }
  };
};

export const soldPropertyThunk = ({
  propertyIndex,
  message,
}: {
  propertyIndex: number;
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedTile } = state.ui;

    dispatch(sellProperty({ propertyIndex }));

    dispatch(writeLog(message));

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
  message,
}: {
  propertyIndex: number;
  changeType: "upgrade" | "downgrade";
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedTile } = state.ui;

    dispatch(setCityLevel({ propertyIndex, changeType }));

    dispatch(writeLog(message));

    if (selectedTile) {
      dispatch(
        setSelectedTile(getState().game.map.board[propertyIndex] as IProperty)
      );
    }
  };
};

export const paidOutOfJailThunk = ({
  message,
}: {
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const { currentPlayerTurnId } = getState().game;

    if (!currentPlayerTurnId) {
      throw new Error("currentPlayerTurnId not found in paidOutOfJailThunk");
    }

    dispatch(
      transferMoney({
        payerId: currentPlayerTurnId,
        amount: PAY_OUT_FROM_JAIL_AMOUNT,
      })
    );

    dispatch(freePlayer({ playerId: currentPlayerTurnId }));

    dispatch(writeLog(message));
  };
};

export const tradeCreatedThunk = (trade: TradeType): AppThunk => {
  return (dispatch, getState) => {
    dispatch(addTradeToQueue(trade));

    // if offeree is the socket
    if (trade.offeree.id === getState().user.socketId) {
      dispatch(setPublished());
      dispatch(setInTrade(true));
      dispatch(setTrade(trade));
      dispatch(setTradeStatus("recieved"));
    }
  };
};

export const tradeAcceptedThunk = ({
  tradeId,
  message,
}: {
  tradeId: string;
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const trade = state.trade.tradesQueue.find((trade) => trade.id === tradeId);

    if (!trade) {
      throw new Error("Trade not found on tradeAcceptedThunk");
    }

    dispatch(completeTrade(trade));

    dispatch(removeTradeFromQueue({ tradeId }));

    // reset trade for traded players
    if (
      trade.offeror.id === state.user.socketId ||
      trade.offeree.id === state.user.socketId
    ) {
      dispatch(resetTrade());
    }

    dispatch(writeLog(message));
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

    if (!trade) {
      throw new Error("Trade not found on tradeDeclinedThunk");
    }

    dispatch(removeTradeFromQueue({ tradeId }));

    // reset trade for traded players
    if (
      trade.offeror.id === state.user.socketId ||
      trade.offeree.id === state.user.socketId
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

    if (trade.turn === getState().user.socketId) {
      dispatch(updateTrade(trade));
      dispatch(setTradeStatus("recieved"));
    }
  };
};
