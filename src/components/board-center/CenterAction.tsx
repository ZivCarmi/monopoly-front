import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn, selectGameBoard } from "@/slices/game-slice";
import {
  PAY_OUT_FROM_JAIL_AMOUNT,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { isPlayerInJail } from "../../utils";
import PayOutOfJailButton from "./PayOutOfJailButton";
import PlayerIsPlayingNotice from "./PlayerIsPlayingNotice";
import PurchasePropertyButton from "./PurchasePropertyButton";
import RollDices from "./RollDices";
import { AnimatePresence } from "framer-motion";

const CenterAction = () => {
  const { canPerformTurnActions, cubesRolledInTurn, selfPlayer } =
    useAppSelector((state) => state.game);
  const currentPlayer = useAppSelector(selectCurrentPlayerTurn);
  const board = useAppSelector(selectGameBoard);

  if (!currentPlayer) {
    return null;
  }

  if (currentPlayer.id !== selfPlayer?.id) {
    return <PlayerIsPlayingNotice />;
  }

  const tile = board[currentPlayer.tilePos];
  const canPurchase = cubesRolledInTurn && isPurchasable(tile) && !tile.owner;

  if (!canPerformTurnActions) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {canPurchase && (
          <PurchasePropertyButton
            isDisabled={currentPlayer.money < tile.cost}
            propertyIndex={currentPlayer.tilePos}
            price={tile.cost}
          />
        )}
        {selfPlayer && isPlayerInJail(selfPlayer.id) && !cubesRolledInTurn && (
          <PayOutOfJailButton
            isDisabled={currentPlayer.money < PAY_OUT_FROM_JAIL_AMOUNT}
          />
        )}
      </AnimatePresence>
      <RollDices />
    </>
  );
};

export default CenterAction;
