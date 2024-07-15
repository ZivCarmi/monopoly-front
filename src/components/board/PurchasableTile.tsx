import { BoardRow } from "@/types/Board";
import { getOppositeBoardSide } from "@/utils";
import {
  PurchasableTile as PurchasableTileType,
  RentIndexes,
  isProperty,
} from "@ziv-carmi/monopoly-utils";
import BuildsIndicator from "./BuildsIndicator";
import OwnerIndicator from "./OwnerIndicator";
import PurchasableTilePopover from "./PurchasableTilePopover";
import Tile from "./Tile";
import TileBackgroundImage from "./TileBackgroundImage";
import TileCostBadge from "./TileCostBadge";

type PurchaseableTileProps = {
  tile: PurchasableTileType;
  rowSide: BoardRow;
};

const PurchasableTile = ({ tile, rowSide }: PurchaseableTileProps) => {
  const hasBuilds = isProperty(tile) && tile.rentIndex !== RentIndexes.BLANK;

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
              {hasBuilds && <BuildsIndicator tile={tile} />}
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
