import { AppThunk } from "@/app/store";
import { movePlayer, transferMoney } from "@/slices/game-slice";
import { GameCardTypes, PaymentTypes } from "@backend/types/Cards";
import {
  AdvancedToTileCard,
  AdvancedToTileTypeCard,
  PaymentCard,
} from "@backend/classes/Cards";

export const paymentGameCard = (
  playerId: string,
  drawnGameCard: PaymentCard
): AppThunk => {
  return (dispatch, getState) => {
    const players = getState().game.players;
    const { event, type } = drawnGameCard;

    switch (type) {
      case GameCardTypes.PAYMENT:
        return dispatch(
          transferMoney({
            payerId: event.paymentType === PaymentTypes.PAY ? playerId : "",
            recieverId: event.paymentType === PaymentTypes.PAY ? "" : playerId,
            amount: event.amount,
          })
        );
      case GameCardTypes.GROUP_PAYMENT:
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

    dispatch(movePlayer({ playerId, tilePosition: event.tileIndex }));
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
      dispatch(movePlayer({ playerId, tilePosition: closestTileTypeIndex }));
    }
  };
};
