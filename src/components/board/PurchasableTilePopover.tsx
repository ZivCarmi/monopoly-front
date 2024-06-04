import { useAppDispatch } from "@/app/hooks";
import { setSelectedTile } from "@/slices/ui-slice";
import { PurchasableTile as PurchasableTileType } from "@ziv-carmi/monopoly-utils";
import TileCard from "../tile-card/TileCard";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/utils";
import { PopoverContentProps } from "@radix-ui/react-popover";

interface PurchasableTilePopoverProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tile: PurchasableTileType;
  popoverContentProps?: PopoverContentProps;
}

const PurchasableTilePopover = ({
  tile,
  className,
  popoverContentProps,
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
      <PopoverContent className="w-64 border-none" {...popoverContentProps}>
        <TileCard />
      </PopoverContent>
    </Popover>
  );
};

export default PurchasableTilePopover;
