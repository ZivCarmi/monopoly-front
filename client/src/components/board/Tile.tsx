import { ITile } from "@backend/types/Board";
import TileBody from "./TileBody";
import TileContent from "./TileContent";

type TileProps = {
  tile: ITile;
};

const Tile: React.FC<TileProps> = ({ tile }) => {
  return (
    <TileContent className="gap-1">
      <TileBody>{tile.name}</TileBody>
    </TileContent>
  );
};

export default Tile;
