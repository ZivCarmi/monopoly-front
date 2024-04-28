import { RentIndexes } from "@ziv-carmi/monopoly-utils";
import { Home, Hotel } from "lucide-react";
import {
  PurchasableTileIconContainer,
  PurchasableTileIconCount,
} from "./PurchasableTileIcon";

const PropertyIcon = ({ rentIndex }: { rentIndex: RentIndexes }) => {
  if (rentIndex === 0) {
    return null;
  }

  const isHotel = rentIndex === 5;

  return (
    <PurchasableTileIconContainer>
      {isHotel ? <Hotel className="w-4 h-4" /> : <Home className="w-4 h-4" />}
      {!isHotel && <PurchasableTileIconCount rentIndex={rentIndex} />}
    </PurchasableTileIconContainer>
  );
};

export default PropertyIcon;
