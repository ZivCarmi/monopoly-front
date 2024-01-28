import { useAppDispatch } from "@/app/hooks";
import { setSelectedTile } from "@/slices/ui-slice";
import { PurchasableTile, RentIndexes, isProperty } from "@backend/types/Board";
import { Home, Hotel } from "lucide-react";
import TileCard from "../tile-card/TileCard";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CityBuilding from "./CityBuilding";
import CityFlagIcon from "./CityFlagIcon";
import OwnerIndicator from "./OwnerIndicator";
import Tile from "./Tile";
import TileCostBadge from "./TileCostBadge";

type PurchasableTileProps = {
  tile: PurchasableTile;
};

const PurchasableTile: React.FC<PurchasableTileProps> = ({ tile }) => {
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
        className="w-full h-full"
      >
        <Tile
          tile={tile}
          className="flex-col justify-between relative tileContent"
        >
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
        </Tile>
        {isProperty(tile) && <CityFlagIcon countryId={tile.country.id} />}
      </PopoverTrigger>
      <PopoverContent>
        <TileCard />
      </PopoverContent>
    </Popover>
  );
};

export default PurchasableTile;
