import { AppThunk } from "@/app/store";
import {
  allowTurnActions,
  drawGameCard,
  freePlayer,
  incrementPlayerPosition,
  movePlayer,
  setDices,
  setIsLanded,
  staySuspendedTurn,
  suspendPlayer,
  transferMoney,
} from "@/slices/game-slice";
import { writeLog } from "@/slices/ui-slice";
import {
  AIRPORT_RENTS,
  COMPANY_RENTS,
  MS_TO_MOVE_ON_TILES,
  getGoTile,
  getJailTileIndex,
  getVacationTileIndex,
  hasBuildings,
  hasMonopoly,
  IJail,
  ITax,
  IVacation,
  PurchasableTile,
  TileTypes,
  isAirport,
  isCard,
  isCompany,
  isGo,
  isGoToJail,
  isProperty,
  isPurchasable,
  isTax,
  isVacation,
  GameCardTypes,
  Player,
} from "@ziv-carmi/monopoly-utils";
import { isPlayerSuspended } from "../utils";
import {
  advanceToTileGameCard,
  advanceToTileTypeGameCard,
  paymentGameCard,
} from "./card-actions";

export const handleDices = (dices: number[]): AppThunk => {
  return (dispatch, getState) => {
    dispatch(setDices({ dices }));

    const { players, currentPlayerTurnId, doublesInARow } = getState().game;
    const player = players.find((player) => player.id === currentPlayerTurnId);
    const isDouble = dices[0] === dices[1];
    const dicesSum = dices.reduce((acc, dice) => acc + dice, 0);

    if (!player) {
      throw new Error("Player was not found");
    }

    if (!currentPlayerTurnId) {
      throw new Error(`Current turn is not belong to ${currentPlayerTurnId}`);
    }

    // update suspended player
    if (isPlayerSuspended(currentPlayerTurnId)?.reason === TileTypes.JAIL) {
      return isDouble
        ? dispatch(freePlayer({ playerId: currentPlayerTurnId }))
        : dispatch(handleStaySuspendedPlayer(currentPlayerTurnId));
    }

    if (isPlayerSuspended(currentPlayerTurnId)?.reason === TileTypes.VACATION) {
      dispatch(freePlayer({ playerId: currentPlayerTurnId }));
    }

    if (doublesInARow === 3) {
      dispatch(sendPlayerToJail(player.id));
      return dispatch(
        writeLog(`${player.name} נשלח לכלא לאחר 3 דאבלים רצופים`)
      );
    }

    dispatch(walkPlayer(currentPlayerTurnId, dicesSum));
  };
};

export const walkPlayer = (playerId: string, steps: number): AppThunk => {
  return (dispatch, getState) => {
    dispatch(allowTurnActions(false));

    // if steps is positive we move forward, otherwise backwards on the board
    const incrementor = steps > 0 ? 1 : -1;

    const update = () => {
      dispatch(incrementPlayerPosition({ playerId, incrementor }));

      const { players, map } = getState().game;
      const walkingPlayer = players.find((player) => playerId === player.id);

      // award player for passing GO tile
      if (walkingPlayer && walkingPlayer.tilePos === 0 && steps > 0) {
        const goTile = getGoTile(map.board);
        const goRewardOnPass = map.goRewards.pass;

        dispatch(
          writeLog(
            `${walkingPlayer.name} עבר ב${goTile.name} והרוויח $${goRewardOnPass}`
          )
        );

        dispatch(
          transferMoney({
            recieverId: playerId,
            amount: goRewardOnPass,
          })
        );
      }

      steps -= incrementor;

      setTimeout(() => {
        if (steps === 0) {
          dispatch(allowTurnActions(true));
          dispatch(handlePlayerLanding(playerId));
          dispatch(setIsLanded(true));
        } else {
          requestAnimationFrame(update);
        }
      }, MS_TO_MOVE_ON_TILES);
    };

    requestAnimationFrame(update);
  };
};

export const handleStaySuspendedPlayer = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { suspendedPlayers } = getState().game;

    if (suspendedPlayers[playerId] === undefined) {
      throw new Error(`Player ID: ${playerId} is not suspended.`);
    }

    const decreasedSuspensionLeft = suspendedPlayers[playerId].left - 1;

    console.log("stay as suspended fn, left:", decreasedSuspensionLeft);

    decreasedSuspensionLeft > 0
      ? dispatch(staySuspendedTurn({ playerId }))
      : dispatch(freePlayer({ playerId }));
  };
};

export const handlePlayerLanding = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { players, map } = getState().game;
    const player = players.find((player) => player.id === playerId);

    if (!player) {
      throw new Error(
        `Could not finish player landing, player with ID of ${playerId} was not found.`
      );
    }

    const landedTile = map.board[player.tilePos];
    const goRewardOnLand = map.goRewards.land;

    if (isGo(landedTile)) {
      const goTile = getGoTile(map.board);

      dispatch(transferMoney({ recieverId: playerId, amount: goRewardOnLand }));
      dispatch(
        writeLog(
          `${player.name} נחת על ${goTile.name} והרוויח $${goRewardOnLand}`
        )
      );
    } else if (isPurchasable(landedTile)) {
      if (!landedTile.owner || landedTile.owner === playerId) return;

      dispatch(handleRentPayment(player, landedTile));
    } else if (isCard(landedTile)) {
      dispatch(
        drawGameCard({ type: landedTile.type, tileIndex: player.tilePos })
      );

      dispatch(handleGameCard(player));
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

export const sendPlayerToVacation = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { map } = getState().game;

    const vacationTileIndex = getVacationTileIndex(map.board);
    const vacationTile = map.board[vacationTileIndex] as IVacation;

    if (!vacationTile) {
      throw new Error("Vacation tile not found on the board");
    }

    dispatch(movePlayer({ playerId, tilePosition: vacationTileIndex }));

    dispatch(
      suspendPlayer({
        playerId,
        suspensionReason: TileTypes.VACATION,
        suspensionLeft: vacationTile.suspensionAmount,
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

    dispatch(movePlayer({ playerId, tilePosition: jailTileIndex }));

    dispatch(
      suspendPlayer({
        playerId,
        suspensionReason: TileTypes.JAIL,
        suspensionLeft: jailTile.suspensionAmount,
      })
    );
  };
};

export const handleGameCard = (player: Player): AppThunk => {
  return (dispatch, getState) => {
    const {
      drawnGameCard: { card },
    } = getState().game;

    if (!card) {
      throw new Error("No chance card was found.");
    }

    switch (card.type) {
      case GameCardTypes.PAYMENT:
      case GameCardTypes.GROUP_PAYMENT:
        return dispatch(paymentGameCard(player.id, card));
      case GameCardTypes.ADVANCE_TO_TILE:
        dispatch(advanceToTileGameCard(player.id, card));
        return dispatch(handlePlayerLanding(player.id));
      case GameCardTypes.ADVANCE_TO_TILE_TYPE:
        dispatch(advanceToTileTypeGameCard(player.id, card));
        return dispatch(handlePlayerLanding(player.id));
      case GameCardTypes.WALK:
        return dispatch(walkPlayer(player.id, card.event.steps));
      case GameCardTypes.GO_TO_JAIL:
        return dispatch(sendPlayerToJail(player.id));
    }
  };
};

export const handleTaxPayment = (player: Player, tile: ITax): AppThunk => {
  return (dispatch) => {
    const rentAmount = Math.ceil((player.money * tile.taxRate) / 100);

    dispatch(
      transferMoney({
        payerId: player.id,
        amount: rentAmount,
      })
    );
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
    } = getState().game;
    const owner = players.find((player) => player.id === tile.owner);
    let rentAmount = 0;

    if (!owner) {
      throw new Error("Owner was not found in handleRentPayment");
    }

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

      rentAmount = Math.ceil((payer.money * rentIndexAmount) / 100);
    }

    dispatch(
      writeLog(
        `${payer.name} שילם שכירות בסך $${rentAmount} לידי ${owner.name}`
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
