import { useAppDispatch } from "@/app/hooks";
import { setSelectedTile } from "@/slices/ui-slice";
import {
  PurchasableTile as PurchasableTileType,
  RentIndexes,
  isProperty,
} from "@ziv-carmi/monopoly-utils";
import { Home, Hotel } from "lucide-react";
import TileCard from "../tile-card/TileCard";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CityBuilding from "./CityBuilding";
import CityFlagIcon from "./CityFlagIcon";
import OwnerIndicator from "./OwnerIndicator";
import Tile from "./Tile";
import TileCostBadge from "./TileCostBadge";
import { AnimatePresence } from "framer-motion";
import TileBackgroundImage from "./TileBackgroundImage";

const PurchasableTile = ({ tile }: { tile: PurchasableTileType }) => {
  const dispatch = useAppDispatch();
  const cityHasHouses =
    isProperty(tile) &&
    tile.rentIndex !== RentIndexes.BLANK &&
    tile.rentIndex !== RentIndexes.HOTEL;
  const cityHasHotel = isProperty(tile) && tile.rentIndex === RentIndexes.HOTEL;

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => dispatch(setSelectedTile(tile))}
        className="w-full h-full flex"
      >
        <Tile
          tile={tile}
          className="flex-col justify-between relative tileContent"
        >
          <AnimatePresence initial={false}>
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
          </AnimatePresence>
        </Tile>
        {isProperty(tile) && <CityFlagIcon countryId={tile.country.id} />}
      </PopoverTrigger>
      <PopoverContent className="w-64 border-none">
        {isProperty(tile) && (
          <TileBackgroundImage tile={tile} className="opacity-15" />
        )}
        <TileCard />
      </PopoverContent>
    </Popover>
  );
};

export default PurchasableTile;
