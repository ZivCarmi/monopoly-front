import {
  PurchasableTile as PurchasableTileType,
  RentIndexes,
  isProperty,
} from "@ziv-carmi/monopoly-utils";
import { Home, Hotel } from "lucide-react";
import CityBuilding from "./CityBuilding";
import OwnerIndicator from "./OwnerIndicator";
import PurchasableTilePopover from "./PurchasableTilePopover";
import Tile from "./Tile";
import TileCostBadge from "./TileCostBadge";
import TileBackgroundImage from "./TileBackgroundImage";
import { BoardRow } from "@/types/Board";
import { getOppositeBoardSide } from "@/utils";

type PurchaseableTileProps = {
  tile: PurchasableTileType;
  rowSide: BoardRow;
};

const PurchasableTile = ({ tile, rowSide }: PurchaseableTileProps) => {
  const cityHasHouses =
    isProperty(tile) &&
    tile.rentIndex !== RentIndexes.BLANK &&
    tile.rentIndex !== RentIndexes.HOTEL;
  const cityHasHotel = isProperty(tile) && tile.rentIndex === RentIndexes.HOTEL;

  return (
    <PurchasableTilePopover
      tile={tile}
      popoverContentProps={{ side: getOppositeBoardSide(rowSide) }}
    >
      {isProperty(tile) && <TileBackgroundImage tile={tile} />}
      <Tile tile={tile} className="justify-between relative" rowSide={rowSide}>
        <div className="flex items-center justify-center grow [max-block-size:2.25rem]">
          {tile.owner ? (
            <OwnerIndicator ownerId={tile.owner}>
              {cityHasHotel && <CityBuilding icon={Hotel} />}
              {cityHasHouses && (
                <CityBuilding icon={Home} count={tile.rentIndex} />
              )}
            </OwnerIndicator>
          ) : (
            <TileCostBadge cost={tile.cost} />
          )}
        </div>
      </Tile>
    </PurchasableTilePopover>
  );
};

export default PurchasableTile;
