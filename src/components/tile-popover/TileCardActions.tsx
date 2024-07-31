import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { selectGameBoard } from "@/slices/game-slice";
import { selectSelectedTileIndex } from "@/slices/game-slice";
import { isPlayerCanSell } from "@/utils";
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

const TileCardActions = ({ tile }: { tile: PurchasableTile }) => {
  const socket = useSocket();
  const propertyIndex = useAppSelector(selectSelectedTileIndex);
  const { selfPlayer } = useAppSelector((state) => state.game);
  const board = useAppSelector(selectGameBoard);

  if (!selfPlayer) {
    return null;
  }

  const canSell = isPlayerCanSell(selfPlayer.id, tile);

  const sellPropertyHandler = () => {
    socket.emit("sell_property", propertyIndex);
  };

  return (
    <div className="space-y-2">
      <Separator className="my-4" />
      <div className="flex gap-2">
        <TooltipProvider delayDuration={0}>
          {isProperty(tile) && <PropertyActions property={tile} />}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                className={
                  isProperty(tile) && hasMonopoly(board, tile.country.id)
                    ? "mr-auto"
                    : "mx-auto"
                }
              >
                <Button
                  variant="destructive"
                  disabled={!canSell.isValid}
                  onClick={sellPropertyHandler}
                  size="icon"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-balance text-center max-w-60">
              {canSell.error ? canSell.error : `מכור עבור ₪${tile.cost / 2}`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TileCardActions;
