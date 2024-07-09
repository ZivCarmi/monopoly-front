import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { selectPurchasableTileIndex } from "@/slices/ui-slice";
import { hasBuildings, isPlayerSuspended, isPlayerTurn } from "@/utils";
import {
  PurchasableTile,
  hasMonopoly,
  isProperty,
} from "@ziv-carmi/monopoly-utils";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import PropertyActions from "./PropertyActions";
import { selectGameBoard } from "@/slices/game-slice";

const TileCardActions = ({ tile }: { tile: PurchasableTile }) => {
  const socket = useSocket();
  const propertyIndex = useAppSelector(selectPurchasableTileIndex);
  const { canPerformTurnActions, selfPlayer } = useAppSelector(
    (state) => state.game
  );
  const board = useAppSelector(selectGameBoard);

  const canSellProperty =
    !!selfPlayer &&
    canPerformTurnActions &&
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
      <div className="flex gap-2">
        <TooltipProvider delayDuration={500}>
          {isProperty(tile) && <PropertyActions property={tile} />}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                disabled={!canSell}
                onClick={sellPropertyHandler}
                size="icon"
                className={
                  isProperty(tile) && hasMonopoly(board, tile.country.id)
                    ? "mr-auto"
                    : "mx-auto"
                }
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-balance text-center">
              מכור עבור ₪{tile.cost / 2}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TileCardActions;
