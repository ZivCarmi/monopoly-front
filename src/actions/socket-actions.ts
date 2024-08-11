import { AppThunk } from "@/app/store";
import {
  addNewMessage,
  addTrade,
  allowTurnActions,
  completeTrade,
  freePlayer,
  purchaseProperty,
  removePlayer,
  removeTrade,
  resetVotekickers,
  selectSelectedTileIndex,
  sellProperty,
  setCityLevel,
  setCurrentPlayerVotekick,
  setHostId,
  setNoAnotherTurn,
  setPardonCardHolder,
  setPlayerPosition,
  setSelectedPopover,
  setVotekickers,
  transferMoney,
  updateTrade,
  writeLog,
} from "@/slices/game-slice";
import {
  resetTrade,
  setMode,
  setTrade,
  setTradeIsOpen,
} from "@/slices/trade-slice";
import { getPlayerName } from "@/utils";
import {
  ChatMessage,
  GameCardDeck,
  getCityLevelText,
  isProperty,
  isPurchasable,
  PAY_OUT_FROM_JAIL_AMOUNT,
  Player,
  PurchasableTile,
  RentIndexes,
  Room,
  TradeType,
} from "@ziv-carmi/monopoly-utils";
import { clearPlayerParticipation } from "./game-actions";
import purchase_sound from "/sounds/purchase-property.wav";
import tradeRecieved_sound from "/sounds/trade-recieved.wav";
import tradeDeclined_sound from "/sounds/trade-declined.wav";
import tradeAccepted_sound from "/sounds/trade-accepted.wav";
import propertyUpgrade_sound from "/sounds/property-upgrade.wav";
import propertyUpgradeMax_sound from "/sounds/property-upgrade-max.wav";
import propertyDowngrade_sound from "/sounds/property-downgrade.wav";
import messageRecieved_sound from "/sounds/message-recieved.wav";

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
          setSelectedPopover(
            getState().game.map.board[selectedTileIndex] as PurchasableTile
          )
        );
      }
    }

    const sound = new Audio(purchase_sound);
    sound.volume = state.ui.volume;
    sound.play();
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
          setSelectedPopover(
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
    const { currentPlayerId, selectedPopover } = state.game;

    if (!currentPlayerId) return;

    const playerName = getPlayerName(currentPlayerId);
    const tile = state.game.map.board[propertyIndex];
    const selectedTileIndex = selectSelectedTileIndex(state);

    if (isProperty(tile)) {
      const isUpgradedToMax = tile.rentIndex + 1 === RentIndexes.HOTEL;
      let cityLevelText = getCityLevelText(tile.rentIndex + 1);
      let message = `${playerName} שדרג ל${cityLevelText} ב${tile.name}`;
      let sound = new Audio(propertyUpgrade_sound);

      if (isUpgradedToMax) {
        sound = new Audio(propertyUpgradeMax_sound);
      }

      if (changeType === "downgrade") {
        sound = new Audio(propertyDowngrade_sound);
        cityLevelText = getCityLevelText(tile.rentIndex - 1);
        message = `${playerName} שנמך ל${cityLevelText} ב${tile.name}`;
      }

      sound.volume = getState().ui.volume;
      sound.play();

      dispatch(setCityLevel({ propertyIndex, changeType }));
      dispatch(writeLog(message));

      if (isProperty(selectedPopover) && selectedTileIndex === propertyIndex) {
        dispatch(
          setSelectedPopover(
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

    dispatch(allowTurnActions(false));
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

    dispatch(allowTurnActions(false));
    dispatch(freePlayer({ playerId: currentPlayerId }));
    dispatch(writeLog(`${playerName} השתמש בכרטיס חנינה כדי לצאת מהכלא`));

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
      setPlayerPosition({
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
      const sound = new Audio(tradeRecieved_sound);
      sound.volume = getState().ui.volume;
      sound.play();

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

    trade.traders.forEach((trader) => {
      if (getState().game.selfPlayer?.id === trader.id) {
        const sound = new Audio(tradeAccepted_sound);
        sound.volume = getState().ui.volume;
        sound.play();
      }
    });

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

    trade.traders.forEach((trader) => {
      if (getState().game.selfPlayer?.id === trader.id) {
        const sound = new Audio(tradeDeclined_sound);
        sound.volume = getState().ui.volume;
        sound.play();
      }
    });

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

      const sound = new Audio(tradeRecieved_sound);
      sound.volume = getState().ui.volume;
      sound.play();

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

    trade.traders.forEach((trader) => {
      if (getState().game.selfPlayer?.id === trader.id) {
        const sound = new Audio(tradeDeclined_sound);
        sound.volume = getState().ui.volume;
        sound.play();
      }
    });

    dispatch(removeTrade({ tradeId }));
    dispatch(writeLog(`${deleterName} ביטל עסקה עם ${otherPlayerName}`));

    if (isStaleTrade) {
      dispatch(resetTrade());
    }
  };
};

export const removeParticipation = ({
  playerId,
  hostId,
}: {
  playerId: string;
  hostId: Room["hostId"];
}): AppThunk => {
  return (dispatch) => {
    dispatch(clearPlayerParticipation(playerId));
    dispatch(removePlayer({ playerId }));
    dispatch(setHostId(hostId));
  };
};

export const playerKickedThunk = (
  kickData: {
    playerId: string;
    hostId: Room["hostId"];
  },
  callback: () => void
): AppThunk => {
  return (dispatch, getState) => {
    const { playerId, hostId } = kickData;
    const state = getState();
    const playerName = getPlayerName(playerId);

    if (state.game.selfPlayer?.id === playerId) {
      callback();
    } else {
      dispatch(removeParticipation({ playerId, hostId }));
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

export const newMessageThunk = (newMessage: ChatMessage): AppThunk => {
  return (dispatch, getState) => {
    const { selfPlayer, chatSound } = getState().game;

    dispatch(addNewMessage(newMessage));

    if (selfPlayer?.id !== newMessage.playerId && chatSound) {
      const sound = new Audio(messageRecieved_sound);
      sound.volume = getState().ui.volume;
      sound.play();
    }
  };
};
