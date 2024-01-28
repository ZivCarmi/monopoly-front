import { CornerGameTile, isJail } from "@backend/types/Board";
import JailTile from "./JailTile";
import Tile from "./Tile";

type CornerTileProps = {
  tile: CornerGameTile;
};

const CornerTile = ({ tile }: CornerTileProps) => {
  return (
    <Tile tile={tile} className="justify-center items-center">
      {isJail(tile) && <JailTile />}
    </Tile>
  );
};

export default CornerTile;
