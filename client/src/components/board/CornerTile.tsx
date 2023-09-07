import { CornerTile } from "@backend/types/Board";
import TileContent from "./TileContent";
import TileBody from "./TileBody";

type CornerTileProps = {
  tile: CornerTile;
};

const CornerTile: React.FC<CornerTileProps> = ({ tile }) => {
  return (
    <TileContent className="items-center justify-center cornerBody">
      <TileBody>{tile.name}</TileBody>
    </TileContent>
  );
};

export default CornerTile;
