import { CornerGameTile, isJail } from "@ziv-carmi/monopoly-utils";
import JailTile from "./JailTile";
import Tile from "./Tile";

type CornerTileProps = {
  tile: CornerGameTile;
};

const CornerTile = ({ tile }: CornerTileProps) => {
  return isJail(tile) ? (
    <Tile tile={tile} hideTileName={true}>
      <JailTile />
    </Tile>
  ) : (
    <Tile tile={tile} className="justify-center items-center" />
  );
};

export default CornerTile;
