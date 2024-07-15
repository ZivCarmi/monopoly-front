import { cn } from "@/utils";
import { RentIndexes } from "@ziv-carmi/monopoly-utils";
import { X } from "lucide-react";

interface PurchasableTileIconContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PurchasableTileIconContainer = ({
  className,
  ...props
}: PurchasableTileIconContainerProps) => {
  return (
    <div
      className={cn("flex items-center gap-0.5 ltr", className)}
      {...props}
    />
  );
};

export const PurchasableTileIconCount = ({
  rentIndex,
}: {
  rentIndex: RentIndexes;
}) => {
  return (
    <span className="flex items-center gap-0.5">
      <X className="w-3 h-3" />
      {rentIndex}
    </span>
  );
};
