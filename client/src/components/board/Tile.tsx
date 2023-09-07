import { ITile } from "@backend/types/Board";
import TileHead from "./TileHead";
import TileBody from "./TileBody";
import TileContent from "./TileContent";

type TileProps = {
  tile: ITile;
};

const Tile: React.FC<TileProps> = ({ tile }) => {
  return (
    <TileContent className="gap-1">
      <TileHead />
      <TileBody>{tile.name}</TileBody>
    </TileContent>
  );
};

export default Tile;
