import { useSocket } from "@/app/socket-context";
import { Button } from "../ui/button";
import PropertyActions from "./PropertyActions";
import { useAppSelector } from "@/app/hooks";
import { PurchasableTile, isProperty } from "@ziv-carmi/monopoly-utils";
import { selectPurchasableTileIndex } from "@/slices/ui-slice";
import { Separator } from "../ui/separator";
import { hasBuildings, isPlayerSuspended, isPlayerTurn } from "@/utils";

type TileCardActionsProps = {
  tile: PurchasableTile;
};

const TileCardActions: React.FC<TileCardActionsProps> = ({ tile }) => {
  const socket = useSocket();
  const propertyIndex = useAppSelector(selectPurchasableTileIndex);
  const { selfPlayer } = useAppSelector((state) => state.game);

  const canSellProperty =
    !!selfPlayer &&
    isPlayerTurn(selfPlayer.id) &&
    !isPlayerSuspended(selfPlayer.id);
  const canSell = isProperty(tile)
    ? canSellProperty && !hasBuildings(tile.country.id)
    : canSellProperty;

  const sellPropertyHandler = () => {
    socket.emit("sell_property", propertyIndex);
  };

  return (
    <div className="space-y-2">
      <Separator className="my-4" />
      {isProperty(tile) && <PropertyActions property={tile} />}
      <Button
        className="w-full"
        variant="destructive"
        disabled={!canSell}
        onClick={sellPropertyHandler}
      >
        מכור עבור ₪{tile.cost / 2}
      </Button>
    </div>
  );
};

export default TileCardActions;
