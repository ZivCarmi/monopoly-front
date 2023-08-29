import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ButtonWithIcon } from "./ui/button";
import { isProperty } from "@/helpers/tiles";
import {
  handlePayOutOfJail,
  handlePurchaseProperty,
} from "@/actions/game-actions";
import RollDices from "./RollDices";
import { ShoppingCart } from "lucide-react";
import { useSocket } from "@/app/socket-context";
import { PurchasableTile, TileTypes } from "@backend/types/Board";
import { selectCurrentPlayerTurn, selectGameBoard } from "@/slices/game-slice";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constants";

const CenterAction = () => {
  const { socket } = useSocket();
  const { canPerformTurnActions, cubesRolledInTurn, suspendedPlayers } =
    useAppSelector((state) => state.game);
  const currentPlayerTurn = useAppSelector(selectCurrentPlayerTurn);
  const board = useAppSelector(selectGameBoard);
  const dispatch = useAppDispatch();

  if (!socket || !currentPlayerTurn || !canPerformTurnActions) {
    return null;
  }

  const selfPlayerSuspended = suspendedPlayers[socket.id];
  const landedTile = board[currentPlayerTurn.tilePos] as PurchasableTile;
  const ableToPurchase =
    cubesRolledInTurn && isProperty(landedTile) && !landedTile.owner;

  return (
    <>
      {ableToPurchase && (
        <p className="bg-white dark:bg-neutral-800 rounded-md p-4 text-center">
          האם אתה מעוניין לרכוש את {landedTile.name}?
        </p>
      )}
      <div className="flex items-center justify-center gap-2">
        {ableToPurchase && (
          <ButtonWithIcon
            icon={ShoppingCart}
            children={`רכוש עבור $${landedTile.cost}`}
            variant="outline"
            onClick={() =>
              dispatch(
                handlePurchaseProperty(socket, currentPlayerTurn.tilePos)
              )
            }
          />
        )}
        {selfPlayerSuspended &&
          selfPlayerSuspended.reason === TileTypes.JAIL &&
          !cubesRolledInTurn && (
            <ButtonWithIcon
              icon={ShoppingCart}
              children={`שלם $${PAY_OUT_FROM_JAIL_AMOUNT} להשתחרר מהכלא`}
              variant="outline"
              onClick={() => dispatch(handlePayOutOfJail(socket))}
            />
          )}
        <RollDices />
      </div>
    </>
  );
};

export default CenterAction;
