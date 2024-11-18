import { useAppDispatch } from "@/app/hooks";
import { setSelectedPopover } from "@/slices/game-slice";
import { cn } from "@/utils";
import {
  PopoverContentProps,
  PopoverTriggerProps,
} from "@radix-ui/react-popover";
import {
  PardonCard,
  PurchasableTile as PurchasableTileType,
} from "@ziv-carmi/monopoly-utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface CardPopoverProps extends PopoverContentProps {
  _content: PurchasableTileType | PardonCard;
  popoverTrigger: PopoverTriggerProps;
}

const CardPopover = ({
  _content,
  popoverTrigger: {
    className: popoverTriggerClassname,
    children: popoverTriggerChildren,
    ...popoverTriggerProps
  },
  className,
  ...props
}: CardPopoverProps) => {
  const dispatch = useAppDispatch();

  return (
    <Popover>
      <PopoverTrigger
        asChild
        className={cn(
          "w-full h-full flex cursor-pointer",
          className,
          popoverTriggerClassname
        )}
        onClick={() => dispatch(setSelectedPopover(_content))}
        {...popoverTriggerProps}
      >
        <div>{popoverTriggerChildren}</div>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-64 border-none", className)}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        {...props}
      />
    </Popover>
  );
};

export default CardPopover;
