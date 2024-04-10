import { useAppDispatch } from "@/app/hooks";
import { resetTrade } from "@/slices/trade-slice";
import { cn } from "@/utils";
import { AlertDialogCancelProps } from "@radix-ui/react-alert-dialog";
import { X } from "lucide-react";
import { AlertDialogCancel } from "../ui/alert-dialog";

export interface TradeDialogCancelProps extends AlertDialogCancelProps {}

const TradeDialogCancel = ({
  onClick,
  className,
  ...props
}: TradeDialogCancelProps) => {
  const dispatch = useAppDispatch();

  return (
    <AlertDialogCancel
      {...props}
      className={cn(
        "absolute left-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-0 border-none hover:bg-transparent h-auto",
        className
      )}
      onClick={() => dispatch(resetTrade())}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">סגור</span>
    </AlertDialogCancel>
  );
};

export default TradeDialogCancel;
