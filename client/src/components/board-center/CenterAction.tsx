import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { selectCurrentPlayerTurn, selectGameBoard } from "@/slices/game-slice";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constants";
import { PurchasableTile, isPurchasable } from "@backend/types/Board";
import { isPlayerInDebt, isPlayerInJail } from "../../utils";
import PayOutOfJailButton from "./PayOutOfJailButton";
import PlayerIsPlayingNotice from "./PlayerIsPlayingNotice";
import PurchasePropertyButton from "./PurchasePropertyButton";
import RollDices from "./RollDices";
import PlayerInDebt from "./PlayerInDebt";

const CenterAction = () => {
  const socket = useSocket();
  const { canPerformTurnActions, cubesRolledInTurn, currentPlayerTurnId } =
    useAppSelector((state) => state.game);
  const currentPlayer = useAppSelector(selectCurrentPlayerTurn);
  const board = useAppSelector(selectGameBoard);

  console.log(canPerformTurnActions);

  if (currentPlayerTurnId !== socket.id) {
    return <PlayerIsPlayingNotice />;
  }

  if (isPlayerInDebt(socket.id)) {
    return <PlayerInDebt />;
  }

  if (!currentPlayer || !canPerformTurnActions) {
    return null;
  }

  const tile = board[currentPlayer.tilePos] as PurchasableTile;
  const canPurchase = cubesRolledInTurn && isPurchasable(tile) && !tile.owner;

  return (
    <>
      {canPurchase && (
        <PurchasePropertyButton
          isDisabled={currentPlayer.money < tile.cost}
          propertyIndex={currentPlayer.tilePos}
          price={tile.cost}
        />
      )}
      {isPlayerInJail(socket.id) && !cubesRolledInTurn && (
        <PayOutOfJailButton
          isDisabled={currentPlayer.money < PAY_OUT_FROM_JAIL_AMOUNT}
        />
      )}
      <RollDices />
    </>
  );
};

export default CenterAction;
