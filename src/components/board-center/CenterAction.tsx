import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn, selectGameBoard } from "@/slices/game-slice";
import {
  PAY_OUT_FROM_JAIL_AMOUNT,
  isAirport,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { AnimatePresence } from "framer-motion";
import {
  getBoardAirports,
  getPlayerAirports,
  isPlayerInJail,
} from "../../utils";
import PayOutOfJailButton from "./PayOutOfJailButton";
import PlayerIsPlayingNotice from "./PlayerIsPlayingNotice";
import PurchasePropertyButton from "./PurchasePropertyButton";
import RollDices from "./RollDices";
import MoveToNextAirportButton from "./MoveToNextAirportButton";
import UsePardonCardButton from "./UsePardonCardButton";

const CenterAction = () => {
  const {
    canPerformTurnActions,
    cubesRolledInTurn,
    selfPlayer,
    forceNoAnotherTurn,
  } = useAppSelector((state) => state.game);
  const currentPlayer = useAppSelector(selectCurrentPlayerTurn);
  const board = useAppSelector(selectGameBoard);

  if (!currentPlayer) {
    return null;
  }

  if (currentPlayer.id !== selfPlayer?.id) {
    return <PlayerIsPlayingNotice />;
  }

  if (!canPerformTurnActions) {
    return null;
  }

  const tile = board[currentPlayer.tilePos];
  const canPurchase = cubesRolledInTurn && isPurchasable(tile) && !tile.owner;
  const canMoveToNextAirport =
    !forceNoAnotherTurn &&
    cubesRolledInTurn &&
    isAirport(tile) &&
    getPlayerAirports(selfPlayer.id).length === getBoardAirports().length;

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
      </AnimatePresence>
      {selfPlayer && isPlayerInJail(selfPlayer.id) && !cubesRolledInTurn && (
        <>
          <PayOutOfJailButton
            isDisabled={currentPlayer.money < PAY_OUT_FROM_JAIL_AMOUNT}
          />
          <UsePardonCardButton />
        </>
      )}
      {canMoveToNextAirport && <MoveToNextAirportButton airport={tile} />}
      <RollDices />
    </>
  );
};

export default CenterAction;
