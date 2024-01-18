import { useAppSelector } from "@/app/hooks";
import { Button } from "../ui/button";
import RollDices from "../RollDices";
import { ShoppingCart } from "lucide-react";
import { useSocket } from "@/app/socket-context2";
import { PurchasableTile, isPurchasable } from "@backend/types/Board";
import { selectCurrentPlayerTurn, selectGameBoard } from "@/slices/game-slice";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constants";
import { isPlayerInJail } from "../../utils";
import Icon from "../ui/icon";

const CenterAction = () => {
  const socket = useSocket();
  const { canPerformTurnActions, cubesRolledInTurn } = useAppSelector(
    (state) => state.game
  );
  const selfPlayer = useAppSelector(selectCurrentPlayerTurn);
  const board = useAppSelector(selectGameBoard);

  if (!selfPlayer || !canPerformTurnActions) {
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
          <Button
            variant="outline"
            onClick={purchasePropertyHandler}
            disabled={selfPlayer.money < tile.cost}
          >
            <Icon icon={ShoppingCart} />
            רכוש עבור {tile.cost}
          </Button>
        )}
        {isPlayerInJail(socket.id) && !cubesRolledInTurn && (
          <Button
            variant="outline"
            onClick={payOutOfJailHandler}
            disabled={selfPlayer.money < PAY_OUT_FROM_JAIL_AMOUNT}
          >
            <Icon icon={ShoppingCart} />
            שלם {PAY_OUT_FROM_JAIL_AMOUNT} להשתחרר מהכלא
          </Button>
        )}
        <RollDices />
      </div>
    </>
  );
};

export default CenterAction;
