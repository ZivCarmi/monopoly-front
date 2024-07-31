import { AppThunk } from "@/app/store";
import {
  EXPERIMENTAL_setGameCard,
  freePlayer,
  removeTrade,
  resetOwner,
  setDices,
  setPardonCardHolder,
  setPlayerPosition,
  setSelfPlayer,
  staySuspendedTurn,
  suspendPlayer,
  switchTurn,
  transferMoney,
  writeLog,
} from "@/slices/game-slice";
import {
  removePlayerProperties,
  resetTrade,
  setPlayerMoney,
} from "@/slices/trade-slice";
import { InvalidTrade } from "@/types/Trade";
import {
  AIRPORT_RENTS,
  COMPANY_RENTS,
  GameCard,
  GameCardTypes,
  IJail,
  ITax,
  IVacation,
  Player,
  PurchasableTile,
  TileTypes,
  WalkObject,
  getGoTile,
  getJailTileIndex,
  getVacationTileIndex,
  hasBuildings,
  hasMonopoly,
  isAirport,
  isCompany,
  isGo,
  isGoToJail,
  isProperty,
  isPurchasable,
  isTax,
  isVacation,
} from "@ziv-carmi/monopoly-utils";
import {
  getPlayerName,
  isPlayer,
  isPlayerInJail,
  isPlayerSuspended,
} from "../utils";
import {
  advanceToTileGameCard,
  advanceToTileTypeGameCard,
  paymentGameCard,
  renovationGameCard,
} from "./card-actions";
import dices_sound1 from "/sounds/dices1.mp3";
import dices_sound2 from "/sounds/dices2.mp3";
import recievedTurn_sound from "/sounds/recieved-turn.wav";
import step_sound from "/sounds/step.ogg";
import payingRent_sound from "/sounds/paying-rent.wav";

export const handleSwitchTurn = (nextPlayerId: string): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    if (isPlayerSuspended(nextPlayerId)?.reason === TileTypes.VACATION) {
      dispatch(freePlayer({ playerId: nextPlayerId }));
    }

    dispatch(switchTurn({ nextPlayerId }));

    if (nextPlayerId === state.user.userId) {
      const sound = new Audio(recievedTurn_sound);
      sound.volume = state.ui.volume;
      sound.play();
    }
  };
};

export const handleDices = (dices: number[]): AppThunk => {
  return (dispatch, getState) => {
    dispatch(setDices({ dices }));

    const { currentPlayerId, doublesInARow } = getState().game;
    const isDouble = dices[0] === dices[1];

    if (!currentPlayerId) {
      throw new Error("currentPlayerId was not found in handleSwitchTurn");
    }

    const playerName = getPlayerName(currentPlayerId);

    // update suspended player
    if (isPlayerSuspended(currentPlayerId)?.reason === TileTypes.JAIL) {
      if (isDouble) {
        dispatch(freePlayer({ playerId: currentPlayerId }));
        dispatch(writeLog(`${playerName} הטיל דאבל ושוחרר מהכלא`));
      } else {
        dispatch(handleStaySuspendedPlayer(currentPlayerId));
      }
      return;
    }

    if (isPlayerSuspended(currentPlayerId)?.reason === TileTypes.VACATION) {
      dispatch(freePlayer({ playerId: currentPlayerId }));
    }

    if (doublesInARow === 3) {
      dispatch(sendPlayerToJail(currentPlayerId));
      return dispatch(writeLog(`${playerName} נשלח לכלא לאחר 3 דאבלים רצופים`));
    }

    const sounds = [new Audio(dices_sound1), new Audio(dices_sound2)];
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    sound.volume = getState().ui.volume;
    sound.play();
  };
};

export const walkPlayer = ({
  playerId,
  position,
  passedGo,
  isLastStep,
}: WalkObject): AppThunk => {
  return (dispatch, getState) => {
    const { players, map } = getState().game;

    dispatch(setPlayerPosition({ playerId, position }));

    if (passedGo) {
      const walkingPlayer = players.find((player) => playerId === player.id);
      const goTile = getGoTile(map.board);
      const goRewardOnPass = map.goRewards.pass;

      if (walkingPlayer) {
        dispatch(
          writeLog(
            `${walkingPlayer.name} עבר ב${goTile.name} והרוויח ₪${goRewardOnPass}`
          )
        );

        dispatch(
          transferMoney({ recieverId: playerId, amount: goRewardOnPass })
        );
      }
    }

    if (isLastStep) {
      dispatch(handlePlayerLanding(playerId, position));
    }

    const sound = new Audio(step_sound);
    sound.volume = getState().ui.volume;
    sound.play();
  };
};

export const handlePlayerLanding = (
  playerId: string,
  landedIndex: number
): AppThunk => {
  return (dispatch, getState) => {
    const { players, map } = getState().game;
    const player = players.find((player) => player.id === playerId);

    if (!player) {
      throw new Error(
        `Could not finish player landing, player with ID of ${playerId} was not found.`
      );
    }

    const landedTile = map.board[landedIndex];
    const goRewardOnLand = map.goRewards.land;

    const paySound = new Audio(payingRent_sound);
    paySound.volume = getState().ui.volume;

    if (isGo(landedTile)) {
      const goTile = getGoTile(map.board);

      dispatch(transferMoney({ recieverId: playerId, amount: goRewardOnLand }));
      dispatch(
        writeLog(
          `${player.name} נחת על ${goTile.name} והרוויח ₪${goRewardOnLand}`
        )
      );
    } else if (isPurchasable(landedTile)) {
      if (!landedTile.owner || landedTile.owner === playerId) return;

      dispatch(handleRentPayment(player, landedTile));
      paySound.play();
    } else if (isTax(landedTile)) {
      dispatch(handleTaxPayment(player, landedTile));
      paySound.play();
    } else if (isVacation(landedTile)) {
      dispatch(sendPlayerToVacation(playerId));
      dispatch(writeLog(`${player.name} יצא לחופשה`));
    } else if (isGoToJail(landedTile)) {
      dispatch(sendPlayerToJail(playerId));
      dispatch(writeLog(`${player.name} נשלח לכלא`));
    }
  };
};

export const handleStaySuspendedPlayer = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { suspendedPlayers } = getState().game;

    if (suspendedPlayers[playerId] === undefined) {
      throw new Error(`Player ID: ${playerId} is not suspended.`);
    }

    const decreasedSuspensionLeft = suspendedPlayers[playerId].left - 1;

    decreasedSuspensionLeft > 0
      ? dispatch(staySuspendedTurn({ playerId }))
      : dispatch(freePlayer({ playerId }));
  };
};

export const sendPlayerToVacation = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { map } = getState().game;

    const vacationTileIndex = getVacationTileIndex(map.board);
    const vacationTile = map.board[vacationTileIndex] as IVacation;

    if (!vacationTile) {
      throw new Error("Vacation tile not found on the board");
    }

    dispatch(
      suspendPlayer({
        playerId,
        suspensionReason: TileTypes.VACATION,
        suspensionLeft: vacationTile.suspensionAmount,
      })
    );
    dispatch(
      setPlayerPosition({
        playerId,
        position: vacationTileIndex,
      })
    );
  };
};

export const sendPlayerToJail = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { map } = getState().game;

    const jailTileIndex = getJailTileIndex(map.board);
    const jailTile = map.board[jailTileIndex] as IJail;

    if (!jailTile) {
      throw new Error("Jail tile not found on the board");
    }

    dispatch(
      suspendPlayer({
        playerId,
        suspensionReason: TileTypes.JAIL,
        suspensionLeft: jailTile.suspensionAmount,
      })
    );
    dispatch(
      setPlayerPosition({
        playerId,
        position: jailTileIndex,
      })
    );
  };
};

export const handleGameCard = (card: GameCard): AppThunk => {
  return (dispatch, getState) => {
    dispatch(EXPERIMENTAL_setGameCard(card));

    const { currentPlayerId, map } = getState().game;
    const { message, event } = card;

    if (!currentPlayerId) {
      throw new Error("currentPlayerId was not found in handleGameCard.");
    }

    const player = isPlayer(currentPlayerId);

    if (!player) {
      throw new Error("player was not found in handleGameCard.");
    }

    dispatch(
      writeLog(
        `${player.name} נחת על ${
          map.board[player.tilePos].name
        } והוציא: ${message}`
      )
    );

    switch (event.type) {
      case GameCardTypes.PAYMENT:
      case GameCardTypes.GROUP_PAYMENT:
        return dispatch(paymentGameCard(currentPlayerId, event));
      case GameCardTypes.ADVANCE_TO_TILE:
        return setTimeout(() => {
          dispatch(advanceToTileGameCard(currentPlayerId, event));
        }, 600);
      case GameCardTypes.ADVANCE_TO_TILE_TYPE:
        return setTimeout(() => {
          dispatch(advanceToTileTypeGameCard(currentPlayerId, event));
        }, 600);
      case GameCardTypes.GO_TO_JAIL:
        return setTimeout(() => {
          dispatch(sendPlayerToJail(currentPlayerId));
        }, 600);
      case GameCardTypes.PARDON:
        return dispatch(
          setPardonCardHolder({ holder: currentPlayerId, deck: event.deck })
        );
      case GameCardTypes.RENOVATION:
        return dispatch(renovationGameCard(currentPlayerId, event));
    }
  };
};

export const handleTaxPayment = (player: Player, tile: ITax): AppThunk => {
  return (dispatch) => {
    const taxAmount = Math.ceil((player.money * tile.taxRate) / 100);

    dispatch(
      transferMoney({
        payerId: player.id,
        amount: taxAmount,
      })
    );
    dispatch(writeLog(`${player.name} שילם מס בסך ₪${taxAmount}`));
  };
};

export const handleRentPayment = (
  payer: Player,
  tile: PurchasableTile
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { board },
      settings,
      dices,
    } = getState().game;
    const owner = players.find((player) => player.id === tile.owner);
    let rentAmount = 0;

    if (!owner) {
      throw new Error("Owner was not found in handleRentPayment");
    }

    if (settings.noRentInPrison && isPlayerInJail(owner.id)) return;

    if (isProperty(tile)) {
      const doubleRent =
        !hasBuildings(board, tile.country.id) &&
        hasMonopoly(board, tile.country.id);

      rentAmount = doubleRent ? tile.rent[0] * 2 : tile.rent[tile.rentIndex];
    } else if (isAirport(tile)) {
      const ownedAirportsCount = board.filter(
        (_tile) => isAirport(_tile) && _tile.owner === owner.id
      ).length;

      rentAmount = AIRPORT_RENTS[ownedAirportsCount - 1];
    } else if (isCompany(tile)) {
      const ownedCompaniesCount = board.filter(
        (_tile) => isCompany(_tile) && _tile.owner === owner.id
      ).length;
      const rentIndexAmount = COMPANY_RENTS[ownedCompaniesCount - 1];
      const dicesSum = dices[0] + dices[1];

      rentAmount = Math.ceil(dicesSum * rentIndexAmount);
    }

    dispatch(
      writeLog(
        `${payer.name} שילם שכירות בסך ₪${rentAmount} לידי ${owner.name}`
      )
    );

    dispatch(
      transferMoney({
        payerId: payer.id,
        recieverId: owner.id,
        amount: rentAmount,
      })
    );
  };
};

export const sanitizeTradeOnErrorThunk = (
  tradeValidity: InvalidTrade
): AppThunk => {
  return (dispatch, getState) => {
    const state = getState().game;
    const { tradeId, error, valid } = tradeValidity;
    const tradingPlayer = isPlayer(error.playerId);

    if (valid || !tradingPlayer) return;

    const trade = state.trades.find((trade) => trade.id === tradeId);

    if (!trade) {
      throw new Error("Trade not found on tradeRefineOnErrorThunk");
    }

    const errorPlayerIndex = trade.traders.findIndex(
      (trader) => trader.id === error.playerId
    );

    if (error.reason === "properties") {
      const playerProperties = trade.traders[errorPlayerIndex].properties;
      const unownedPlayerProperties = playerProperties.filter((propIdx) => {
        const tile = state.map.board[propIdx];

        return isPurchasable(tile) ? tile.owner !== error.playerId : false;
      });

      dispatch(
        removePlayerProperties({
          traderId: error.playerId,
          tileIndexesToRemove: unownedPlayerProperties,
        })
      );
    } else if (error.reason === "money") {
      dispatch(
        setPlayerMoney({
          traderId: error.playerId,
          amount: tradingPlayer.money,
        })
      );
    }
  };
};

export const clearPlayerParticipation = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { map, selfPlayer, trades } = getState().game;

    [map.chances, map.surprises].forEach(({ deck, pardonCardHolder }) => {
      if (pardonCardHolder === playerId) {
        dispatch(setPardonCardHolder({ deck, holder: null }));
      }
    });

    if (selfPlayer?.id === playerId) {
      dispatch(setSelfPlayer(null));
    }

    const playerTrades = trades.filter(
      (trade) =>
        trade.traders[0].id === playerId || trade.traders[1].id === playerId
    );

    playerTrades.forEach((trade) =>
      dispatch(removeTrade({ tradeId: trade.id }))
    );

    dispatch(resetTrade());
    dispatch(resetOwner({ playerId }));
    dispatch(freePlayer({ playerId }));
    dispatch(setPlayerPosition({ playerId, position: -1 }));
  };
};
