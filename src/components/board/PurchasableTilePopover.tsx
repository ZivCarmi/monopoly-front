import { useAppDispatch } from "@/app/hooks";
import { setSelectedTile } from "@/slices/ui-slice";
import { PurchasableTile as PurchasableTileType } from "@ziv-carmi/monopoly-utils";
import TileCard from "../tile-card/TileCard";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/utils";

interface PurchasableTilePopoverProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tile: PurchasableTileType;
}

const PurchasableTilePopover = ({
  tile,
  className,
  ...props
}: PurchasableTilePopoverProps) => {
  const dispatch = useAppDispatch();

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => dispatch(setSelectedTile(tile))}
        className={cn("w-full h-full flex", className)}
        {...props}
      />
      <PopoverContent className="w-64 border-none">
        <TileCard />
      </PopoverContent>
    </Popover>
  );
};

export default PurchasableTilePopover;
