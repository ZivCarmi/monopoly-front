import { useAppDispatch } from "@/app/hooks";
import { setPlayerProperties } from "@/slices/trade-slice";
import { cn, PlayerPurchasableWithIndex } from "@/utils";
import { TradePlayer } from "@ziv-carmi/monopoly-utils";
import TileIcon from "../board/TileIcon";
import { Button, ButtonProps } from "../ui/button";

interface PurchasableTradeItemProps extends ButtonProps {
  trader: TradePlayer;
  purchasable: PlayerPurchasableWithIndex;
}

const PurchasableTradeItem = ({
  trader,
  purchasable,
  className,
  ...props
}: PurchasableTradeItemProps) => {
  const { tile, index } = purchasable;
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="blank"
      className={cn(
        "justify-start gap-2 border",
        trader.properties.includes(index) && "bg-violet-800",
        className
      )}
      onClick={() =>
        dispatch(setPlayerProperties({ traderId: trader.id, tileIndex: index }))
      }
      {...props}
    >
      {tile.icon && (
        <TileIcon tile={tile} className="w-4 h-4 p-0 rounded-full" />
      )}
      {tile.name}
    </Button>
  );
};

export default PurchasableTradeItem;
