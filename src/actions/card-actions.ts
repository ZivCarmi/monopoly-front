import { AppThunk } from "@/app/store";
import { setPlayerPosition, transferMoney } from "@/slices/game-slice";
import { writeLog } from "@/slices/ui-slice";
import { hasBuildings, isPlayer } from "@/utils";
import {
  AdvancedToTileGameCardEvent,
  AdvancedToTileTypeGameCardEvent,
  GameCardTypes,
  getGoTile,
  isProperty,
  PaymentGameCardEvent,
  PaymentTypes,
  RenovationGameCardEvent,
  RentIndexes,
} from "@ziv-carmi/monopoly-utils";
import { handlePlayerLanding } from "./game-actions";

export const paymentGameCard = (
  playerId: string,
  event: PaymentGameCardEvent
): AppThunk => {
  return (dispatch, getState) => {
    const players = getState().game.players;
    const { type, amount, paymentType } = event;

    if (type === GameCardTypes.PAYMENT) {
      return dispatch(
        transferMoney({
          payerId: paymentType === PaymentTypes.PAY ? playerId : "",
          recieverId: paymentType === PaymentTypes.PAY ? "" : playerId,
          amount: amount,
        })
      );
    } else if (type === GameCardTypes.GROUP_PAYMENT) {
      for (const player of players) {
        if (player.id === playerId) continue;

        dispatch(
          transferMoney({
            payerId: paymentType === PaymentTypes.PAY ? playerId : player.id,
            recieverId: paymentType === PaymentTypes.PAY ? player.id : playerId,
            amount: amount,
          })
        );
      }
    }
  };
};

export const advanceToTileGameCard = (
  playerId: string,
  event: AdvancedToTileGameCardEvent
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { board, goRewards },
    } = getState().game;
    const { shouldGetGoReward, tileIndex } = event;
    const player = players.find((player) => player.id === playerId);

    if (!player) throw new Error("Player not found on advanceToTileGameCard");

    if (shouldGetGoReward) {
      const shouldGetPassReward = tileIndex !== 0 && player.tilePos > tileIndex;

      if (shouldGetPassReward) {
        const goTile = getGoTile(board);

        dispatch(
          writeLog(
            `${player.name} עבר ב${goTile.name} והרוויח ₪${goRewards.pass}`
          )
        );
        dispatch(
          transferMoney({
            recieverId: playerId,
            amount: goRewards.pass,
          })
        );
      }
    }

    dispatch(
      setPlayerPosition({
        playerId,
        position: event.tileIndex,
      })
    );
    dispatch(handlePlayerLanding(playerId, event.tileIndex));
  };
};

export const advanceToTileTypeGameCard = (
  playerId: string,
  event: AdvancedToTileTypeGameCardEvent
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { board },
    } = getState().game;
    const { tileType } = event;
    const player = players.find((player) => player.id === playerId);
    let closestTileTypeIndex: number | null = null;

    if (!player)
      throw new Error("Player not found on advanceToTileTypeGameCard");

    // get closest tile that match the event type
    for (let [tileIndex, tile] of board.entries()) {
      if (tile.type === tileType && player.tilePos < tileIndex) {
        closestTileTypeIndex = tileIndex;
        break;
      } else if (tileIndex === board.length - 1) {
        closestTileTypeIndex = board.findIndex(
          (_tile) => _tile.type === tileType
        );
        break;
      }
    }

    if (closestTileTypeIndex !== null) {
      dispatch(
        setPlayerPosition({
          playerId,
          position: closestTileTypeIndex,
        })
      );
      dispatch(handlePlayerLanding(playerId, closestTileTypeIndex));
    }
  };
};

export const renovationGameCard = (
  playerId: string,
  event: RenovationGameCardEvent
): AppThunk => {
  return (dispatch, getState) => {
    const {
      map: { board },
    } = getState().game;
    const { amountPerHouse, amountPerHotel } = event;
    const player = isPlayer(playerId);

    if (!player) {
      throw new Error("Player not found on renovationGameCard");
    }

    const arrayToSum = board.map((tile) => {
      if (
        isProperty(tile) &&
        tile.owner === playerId &&
        hasBuildings(tile.country.id)
      ) {
        const isHouse =
          tile.rentIndex > RentIndexes.BLANK &&
          tile.rentIndex < RentIndexes.HOTEL;
        const isHotel = tile.rentIndex === RentIndexes.HOTEL;

        if (isHouse) {
          return amountPerHouse * tile.rentIndex;
        } else if (isHotel) {
          return amountPerHotel;
        }
      }

      return 0;
    });

    const totalPayment = arrayToSum.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    dispatch(
      transferMoney({
        payerId: playerId,
        amount: totalPayment,
      })
    );
  };
};
