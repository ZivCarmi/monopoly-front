import { useAppSelector } from "@/app/hooks";
import { ButtonWithIcon } from "../ui/button";
import RollDices from "../RollDices";
import { ShoppingCart } from "lucide-react";
import { useSocket } from "@/app/socket-context";
import { PurchasableTile, isPurchasable } from "@backend/types/Board";
import { selectCurrentPlayerTurn, selectGameBoard } from "@/slices/game-slice";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constants";
import { isPlayerInJail } from "../../utils";

const CenterAction = () => {
  const { socket } = useSocket();
  const { canPerformTurnActions, cubesRolledInTurn } = useAppSelector(
    (state) => state.game
  );
  const selfPlayer = useAppSelector(selectCurrentPlayerTurn);
  const board = useAppSelector(selectGameBoard);

  if (!socket || !selfPlayer || !canPerformTurnActions) {
    return null;
  }

  const tile = board[selfPlayer.tilePos] as PurchasableTile;
  const canPurchase = cubesRolledInTurn && isPurchasable(tile) && !tile.owner;

  const purchasePropertyHandler = () => {
    socket.emit("purchase_property", {
      propertyIndex: selfPlayer.tilePos,
    });
  };

  const payOutOfJailHandler = () => {
    socket.emit("pay_out_of_jail");
  };

  return (
    <>
      {canPurchase && (
        <p className="bg-white dark:bg-neutral-800 rounded-md p-4 text-center">
          האם אתה מעוניין לרכוש את {tile.name}?
        </p>
      )}
      <div className="flex items-center justify-center gap-2">
        {canPurchase && (
          <ButtonWithIcon
            icon={ShoppingCart}
            children={`רכוש עבור $${tile.cost}`}
            variant="outline"
            disabled={selfPlayer.money < tile.cost}
            onClick={purchasePropertyHandler}
          />
        )}
        {isPlayerInJail(socket.id) && !cubesRolledInTurn && (
          <ButtonWithIcon
            icon={ShoppingCart}
            children={`שלם $${PAY_OUT_FROM_JAIL_AMOUNT} להשתחרר מהכלא`}
            variant="outline"
            disabled={selfPlayer.money < PAY_OUT_FROM_JAIL_AMOUNT}
            onClick={payOutOfJailHandler}
          />
        )}
        <RollDices />
      </div>
    </>
  );
};

export default CenterAction;
