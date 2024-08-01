import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn, selectGameBoard } from "@/slices/game-slice";
import {
  PAY_OUT_FROM_JAIL_AMOUNT,
  isAirport,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Fragment } from "react";
import {
  getBoardAirports,
  getPlayerAirports,
  isPlayerInJail,
} from "../../utils";
import MoveToNextAirportButton from "./MoveToNextAirportButton";
import PayOutOfJailButton from "./PayOutOfJailButton";
import PlayerIsPlayingNotice from "./PlayerIsPlayingNotice";
import PurchasePropertyButton from "./PurchasePropertyButton";
import RollDices from "./RollDices";
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
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {canPurchase && (
          <PurchasePropertyButton
            key="purchase-button"
            isDisabled={currentPlayer.money < tile.cost}
            propertyIndex={currentPlayer.tilePos}
            price={tile.cost}
          />
        )}
        {selfPlayer && isPlayerInJail(selfPlayer.id) && !cubesRolledInTurn && (
          <Fragment key="jail-buttons">
            <PayOutOfJailButton
              isDisabled={currentPlayer.money < PAY_OUT_FROM_JAIL_AMOUNT}
            />
            <UsePardonCardButton />
          </Fragment>
        )}
        {canMoveToNextAirport && (
          <MoveToNextAirportButton key="travel-button" airport={tile} />
        )}
      </AnimatePresence>
      <RollDices />
    </LayoutGroup>
  );
};

export default CenterAction;
