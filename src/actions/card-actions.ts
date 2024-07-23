import { AppThunk } from "@/app/store";
import {
  EXPERIMENTAL_incrementPlayerPosition,
  transferMoney,
} from "@/slices/game-slice";
import {
  GameCardTypes,
  PaymentTypes,
  AdvancedToTileCard,
  AdvancedToTileTypeCard,
  PaymentCard,
  RenovationCard,
  isProperty,
  RentIndexes,
} from "@ziv-carmi/monopoly-utils";
import { handlePlayerLanding } from "./game-actions";
import { hasBuildings, isPlayer } from "@/utils";

export const paymentGameCard = (
  playerId: string,
  drawnGameCard: PaymentCard
): AppThunk => {
  return (dispatch, getState) => {
    const players = getState().game.players;
    const { event, type } = drawnGameCard;

    if (type === GameCardTypes.PAYMENT) {
      return dispatch(
        transferMoney({
          payerId: event.paymentType === PaymentTypes.PAY ? playerId : "",
          recieverId: event.paymentType === PaymentTypes.PAY ? "" : playerId,
          amount: event.amount,
        })
      );
    } else if (type === GameCardTypes.GROUP_PAYMENT) {
      for (const player of players) {
        if (player.id === playerId) continue;

        dispatch(
          transferMoney({
            payerId:
              event.paymentType === PaymentTypes.PAY ? playerId : player.id,
            recieverId:
              event.paymentType === PaymentTypes.PAY ? player.id : playerId,
            amount: event.amount,
          })
        );
      }
    }
  };
};

export const advanceToTileGameCard = (
  playerId: string,
  drawnGameCard: AdvancedToTileCard
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { goRewards },
    } = getState().game;
    const { event } = drawnGameCard;
    const player = players.find((player) => player.id === playerId);

    if (!player) throw new Error("Player not found before advancing to tile");

    if (event.shouldGetGoReward) {
      const shouldGetPassReward =
        event.tileIndex !== 0 && player.tilePos > event.tileIndex;

      if (shouldGetPassReward) {
        dispatch(
          transferMoney({
            recieverId: playerId,
            amount: goRewards.pass,
          })
        );
      }
    }

    dispatch(
      EXPERIMENTAL_incrementPlayerPosition({
        playerId,
        position: event.tileIndex,
      })
    );
    dispatch(handlePlayerLanding(playerId, event.tileIndex));
  };
};

export const advanceToTileTypeGameCard = (
  playerId: string,
  drawnGameCard: AdvancedToTileTypeCard
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { board },
    } = getState().game;
    const { event } = drawnGameCard;
    const player = players.find((player) => player.id === playerId);
    let closestTileTypeIndex: number | null = null;

    if (!player)
      throw new Error("Player not found before advancing to tile type");

    // get closest tile that match the event type
    for (let [tileIndex, tile] of board.entries()) {
      if (tile.type === event.tileType && player.tilePos < tileIndex) {
        closestTileTypeIndex = tileIndex;
        break;
      } else if (tileIndex === board.length - 1) {
        closestTileTypeIndex = board.findIndex(
          (_tile) => _tile.type === event.tileType
        );
        break;
      }
    }

    if (closestTileTypeIndex !== null) {
      dispatch(
        EXPERIMENTAL_incrementPlayerPosition({
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
  drawnGameCard: RenovationCard
): AppThunk => {
  return (dispatch, getState) => {
    const {
      map: { board },
    } = getState().game;
    const {
      event: { amountPerHouse, amountPerHotel },
    } = drawnGameCard;
    const player = isPlayer(playerId);

    if (!player) {
      throw new Error("Player not found before renovating");
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
