import { CornerGameTile, isJail } from "@ziv-carmi/monopoly-utils";
import JailTile from "./JailTile";
import Tile from "./Tile";
import { BoardRow } from "@/types/Board";

type CornerTile = {
  tile: CornerGameTile;
  rowSide: BoardRow;
};

const CornerTile = ({ tile, rowSide }: CornerTile) => {
  return isJail(tile) ? (
    <JailTile />
  ) : (
    <Tile
      tile={tile}
      rowSide={rowSide}
      className="justify-center items-center"
    />
  );
};

export default CornerTile;
