import { PurchasableTile, isProperty } from "@backend/types/Board";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import TileCard from "../tile-card/TileCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSelectedTile } from "@/slices/ui-slice";
import { selectPlayers } from "@/slices/game-slice";
import TileHead from "./TileHead";
import TileBody from "./TileBody";
import TileContent from "./TileContent";

type PurchasableTileProps = {
  tile: PurchasableTile;
};

const PurchasableTile: React.FC<PurchasableTileProps> = ({ tile }) => {
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectPlayers);
  const ownerColor = players.find((player) => player.id === tile.owner)?.color;

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => dispatch(setSelectedTile(tile))}
        className="w-full h-full relative"
      >
        <TileContent className="gap-1">
          <TileHead
            style={{
              backgroundColor: isProperty(tile) ? tile.color : undefined,
            }}
          />
          <TileBody>{tile.name}</TileBody>
          {tile.owner && (
            <div
              className="w-full flex-[0_0_20%] ownerColor"
              style={{
                backgroundColor: ownerColor,
              }}
            />
          )}
        </TileContent>
      </PopoverTrigger>
      <PopoverContent>
        <TileCard />
      </PopoverContent>
    </Popover>
  );
};

export default PurchasableTile;
