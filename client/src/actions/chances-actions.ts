import { AppThunk } from "@/app/store";
import { movePlayer, transferMoney } from "@/slices/game-slice";
import {
  AdvancedToTileCard,
  AdvancedToTileTypeCard,
  ChanceCardTypes,
  PaymentCard,
  PaymentTypes,
} from "@backend/types/Cards";

export const paymentChanceCard = (
  playerId: string,
  drawnChanceCard: PaymentCard
): AppThunk => {
  return (dispatch, getState) => {
    const players = getState().game.players;
    const { event, type } = drawnChanceCard;

    switch (type) {
      case ChanceCardTypes.PAYMENT:
        return dispatch(
          transferMoney({
            payerId: event.paymentType === PaymentTypes.PAY ? playerId : "",
            recieverId: event.paymentType === PaymentTypes.PAY ? "" : playerId,
            amount: event.amount,
          })
        );
      case ChanceCardTypes.GROUP_PAYMENT:
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

export const advanceToTileChanceCard = (
  playerId: string,
  drawnChanceCard: AdvancedToTileCard
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { goRewards },
    } = getState().game;
    const { event } = drawnChanceCard;
    const player = players.find((player) => player.id === playerId);

    if (!player) throw new Error("Player not found before advancing to tile");

    dispatch(movePlayer({ playerId, tilePosition: event.tileIndex }));

    if (event.shouldGetGoReward) {
      const shouldGetLandReward = event.tileIndex === 0;
      const shouldGetPassReward = player.tilePos > event.tileIndex;
      let rewardAmount: number = 0;

      if (shouldGetLandReward) {
        rewardAmount = goRewards.land;
      } else if (shouldGetPassReward) {
        rewardAmount = goRewards.pass;
      }

      if (rewardAmount) {
        dispatch(
          transferMoney({
            recieverId: playerId,
            amount: rewardAmount,
          })
        );
      }
    }
  };
};

export const advanceToTileTypeChanceCard = (
  playerId: string,
  drawnChanceCard: AdvancedToTileTypeCard
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { board },
    } = getState().game;
    const { event } = drawnChanceCard;
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
