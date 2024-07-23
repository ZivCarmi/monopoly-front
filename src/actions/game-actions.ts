import { AppThunk } from "@/app/store";
import {
  EXPERIMENTAL_incrementPlayerPosition,
  EXPERIMENTAL_setGameCard,
  freePlayer,
  setDices,
  staySuspendedTurn,
  suspendPlayer,
  transferMoney,
} from "@/slices/game-slice";
import { removePlayerProperties, setPlayerMoney } from "@/slices/trade-slice";
import { writeLog } from "@/slices/ui-slice";
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

export const handleDices = (dices: number[]): AppThunk => {
  return (dispatch, getState) => {
    dispatch(setDices({ dices }));

    const { currentPlayerId, doublesInARow } = getState().game;
    const isDouble = dices[0] === dices[1];

    if (!currentPlayerId) {
      throw new Error("currentPlayerId was not found");
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

    dispatch(EXPERIMENTAL_incrementPlayerPosition({ playerId, position }));

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
    } else if (isTax(landedTile)) {
      dispatch(handleTaxPayment(player, landedTile));
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
      EXPERIMENTAL_incrementPlayerPosition({
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
      EXPERIMENTAL_incrementPlayerPosition({
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

    if (!currentPlayerId) {
      throw new Error("currentPlayerId was not found in handleGameCard.");
    }

    const player = isPlayer(currentPlayerId);

    if (!player) {
      throw new Error("player was not found in handleGameCard.");
    }

    dispatch(
      writeLog(
        `${player.name} נחת על ${map.board[player.tilePos].name} והוציא: ${
          card.message
        }`
      )
    );

    switch (card.type) {
      case GameCardTypes.PAYMENT:
      case GameCardTypes.GROUP_PAYMENT:
        return dispatch(paymentGameCard(currentPlayerId, card));
      case GameCardTypes.ADVANCE_TO_TILE:
        return setTimeout(() => {
          dispatch(advanceToTileGameCard(currentPlayerId, card));
        }, 600);
      case GameCardTypes.ADVANCE_TO_TILE_TYPE:
        return setTimeout(() => {
          dispatch(advanceToTileTypeGameCard(currentPlayerId, card));
        }, 600);
      case GameCardTypes.GO_TO_JAIL:
        return setTimeout(() => {
          dispatch(sendPlayerToJail(currentPlayerId));
        }, 600);
      // case GameCardTypes.PARDON:
      // return setTimeout(() => {
      // console.log("pardon card");
      // dispatch(sendPlayerToJail(currentPlayerId));
      // }, 600);
      case GameCardTypes.RENOVATION:
        return setTimeout(() => {
          dispatch(renovationGameCard(currentPlayerId, card));
        }, 600);
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
