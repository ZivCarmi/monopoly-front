import { IProperty, RentIndexes } from "@ziv-carmi/monopoly-utils";
import { Home, Hotel } from "lucide-react";
import {
  PurchasableTileIconContainer,
  PurchasableTileIconCount,
} from "./PurchasableTileIcon";

const BuildsIndicator = ({ tile }: { tile: IProperty }) => {
  if (tile.rentIndex === RentIndexes.BLANK) {
    return null;
  }

  if (tile.rentIndex === RentIndexes.HOTEL) {
    return (
      <PurchasableTileIconContainer className="cityBuilding text-black">
        <Hotel className="w-4 h-4" />
      </PurchasableTileIconContainer>
    );
  }

  return (
    <PurchasableTileIconContainer className="cityBuilding text-black">
      <Home className="w-4 h-4" />
      <PurchasableTileIconCount rentIndex={tile.rentIndex} />
    </PurchasableTileIconContainer>
  );
};

export default BuildsIndicator;
