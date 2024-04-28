import { RentIndexes } from "@ziv-carmi/monopoly-utils";
import { X } from "lucide-react";

export const PurchasableTileIconContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex items-center gap-0.5 ltr">{children}</div>;
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
