import { AppThunk } from "@/app/store";
import {
  addTrade,
  completeTrade,
  EXPERIMENTAL_incrementPlayerPosition,
  freePlayer,
  purchaseProperty,
  removePlayer,
  removeTrade,
  resetVotekickers,
  sellProperty,
  setCityLevel,
  setCurrentPlayerVotekick,
  setNoAnotherTurn,
  setPardonCardHolder,
  setVotekickers,
  transferMoney,
  updateTrade,
} from "@/slices/game-slice";
import {
  resetTrade,
  setMode,
  setTrade,
  setTradeIsOpen,
} from "@/slices/trade-slice";
import {
  selectSelectedTileIndex,
  setSelectedTile,
  writeLog,
} from "@/slices/ui-slice";
import { getPlayerName } from "@/utils";
import {
  GameCardDeck,
  getCityLevelText,
  isProperty,
  isPurchasable,
  PAY_OUT_FROM_JAIL_AMOUNT,
  Player,
  PurchasableTile,
  TradeType,
} from "@ziv-carmi/monopoly-utils";

export const purchasedPropertyThunk = (propertyIndex: number): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { currentPlayerId } = state.game;

    if (!currentPlayerId) return;

    const playerName = getPlayerName(currentPlayerId);
    const tile = getState().game.map.board[propertyIndex];
    const selectedTileIndex = selectSelectedTileIndex(state);

    if (isPurchasable(tile)) {
      dispatch(purchaseProperty({ propertyIndex }));
      dispatch(writeLog(`${playerName} רכש את ${tile.name}`));

      if (selectedTileIndex === propertyIndex) {
        dispatch(
          setSelectedTile(
            getState().game.map.board[selectedTileIndex] as PurchasableTile
          )
        );
      }
    }
  };
};

export const soldPropertyThunk = (propertyIndex: number): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { currentPlayerId } = state.game;

    if (!currentPlayerId) return;

    const playerName = getPlayerName(currentPlayerId);
    const tile = getState().game.map.board[propertyIndex];
    const selectedTileIndex = selectSelectedTileIndex(state);

    if (isPurchasable(tile)) {
      dispatch(sellProperty({ propertyIndex }));
      dispatch(writeLog(`${playerName} מכר את ${tile.name}`));

      if (selectedTileIndex === propertyIndex) {
        dispatch(
          setSelectedTile(
            getState().game.map.board[selectedTileIndex] as PurchasableTile
          )
        );
      }
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
    const { currentPlayerId } = state.game;
    const { selectedTile } = state.ui;

    if (!currentPlayerId) return;

    const playerName = getPlayerName(currentPlayerId);
    const tile = state.game.map.board[propertyIndex];
    const selectedTileIndex = selectSelectedTileIndex(state);

    if (isProperty(tile)) {
      let cityLevelText = getCityLevelText(tile.rentIndex + 1);
      let message = `${playerName} שדרג ל${cityLevelText} ב${tile.name}`;

      if (changeType === "downgrade") {
        cityLevelText = getCityLevelText(tile.rentIndex - 1);
        message = `${playerName} שנמך ל${cityLevelText} ב${tile.name}`;
      }

      dispatch(setCityLevel({ propertyIndex, changeType }));
      dispatch(writeLog(message));

      if (isProperty(selectedTile) && selectedTileIndex === propertyIndex) {
        dispatch(
          setSelectedTile(
            getState().game.map.board[selectedTileIndex] as PurchasableTile
          )
        );
      }
    }
  };
};

export const paidOutOfJailThunk = (): AppThunk => {
  return (dispatch, getState) => {
    const { currentPlayerId } = getState().game;

    if (!currentPlayerId) {
      throw new Error("currentPlayerId not found in paidOutOfJailThunk");
    }

    const playerName = getPlayerName(currentPlayerId);

    dispatch(
      transferMoney({
        payerId: currentPlayerId,
        amount: PAY_OUT_FROM_JAIL_AMOUNT,
      })
    );
    dispatch(freePlayer({ playerId: currentPlayerId }));
    dispatch(
      writeLog(
        `${playerName} שילם ₪${PAY_OUT_FROM_JAIL_AMOUNT} עבור שחרור מהכלא`
      )
    );
  };
};

export const usedPardonCardThunk = (fromDeck: GameCardDeck): AppThunk => {
  return (dispatch, getState) => {
    const {
      map: { chances },
      currentPlayerId,
    } = getState().game;

    if (!currentPlayerId) {
      throw new Error("currentPlayerId not found in usedPardonCardThunk");
    }

    const playerName = getPlayerName(currentPlayerId);

    dispatch(writeLog(`${playerName} השתמש בכרטיס חנינה כדי לצאת מהכלא`));
    dispatch(freePlayer({ playerId: currentPlayerId }));

    if (chances.deck === fromDeck) {
      dispatch(setPardonCardHolder({ deck: fromDeck, holder: null }));
    } else {
      dispatch(setPardonCardHolder({ deck: fromDeck, holder: null }));
    }
  };
};

export const movedToNextAirportThunk = (airportIndex: number): AppThunk => {
  return (dispatch, getState) => {
    const {
      currentPlayerId,
      map: { board },
    } = getState().game;
    const nextAirport = board[airportIndex];

    if (!currentPlayerId) {
      throw new Error("currentPlayerId not found in movedToNextAirportThunk");
    }

    const playerName = getPlayerName(currentPlayerId);

    dispatch(
      EXPERIMENTAL_incrementPlayerPosition({
        playerId: currentPlayerId,
        position: airportIndex,
      })
    );
    dispatch(setNoAnotherTurn(true));
    dispatch(writeLog(`${playerName} דילג ל${nextAirport.name}`));
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
      const isOnSameOldTrade =
        state.trade.tradeIsOpen && state.trade.trade?.id === trade.id;
      const isNotWatchingTrade =
        !state.trade.tradeIsOpen && !state.trade.selectPlayerIsOpen;

      if (isOnSameOldTrade) {
        dispatch(setTrade(trade));
        dispatch(setMode("watching"));
      } else if (isNotWatchingTrade) {
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

export const playerKickedThunk = (
  kickedPlayerId: string,
  callback: () => void
): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const playerName = getPlayerName(kickedPlayerId);

    if (state.game.selfPlayer?.id === kickedPlayerId) {
      callback();
    } else {
      dispatch(removePlayer({ playerId: kickedPlayerId }));
      dispatch(writeLog(`${playerName} הודח מהמשחק`));
      dispatch(resetVotekickers());
    }
  };
};

export const newVotekickThunk = ({
  votekicker,
  votekickAt,
}: {
  votekicker: Player;
  votekickAt: Date;
}): AppThunk => {
  return (dispatch, getState) => {
    const { currentPlayerId, players } = getState().game;
    const currentPlayer = players.find(
      (playerId) => currentPlayerId === playerId.id
    );
    const playersCountWithoutCurrentPlayer = players.length - 1;

    if (!currentPlayer) {
      throw new Error("currentPlayer was not found in newVotekickThunk");
    }

    // CHECK WHY NOT WORK

    dispatch(setVotekickers({ votekickerId: votekicker.id }));
    dispatch(setCurrentPlayerVotekick({ kickAt: votekickAt }));

    let log = `${votekicker.name} בחר להדיח את ${currentPlayer.name}`;

    if (players.length > 2) {
      log += `. (${
        getState().game.voteKickers.length
      }/${playersCountWithoutCurrentPlayer})`;
    }

    dispatch(writeLog(log));
  };
};
