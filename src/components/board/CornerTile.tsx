import { CornerGameTile, isJail } from "@ziv-carmi/monopoly-utils";
import JailTile from "./JailTile";
import Tile from "./Tile";

const CornerTile = ({ tile }: { tile: CornerGameTile }) => {
  return isJail(tile) ? (
    <JailTile />
  ) : (
    <Tile tile={tile} className="justify-center items-center" />
  );
};

export default CornerTile;
