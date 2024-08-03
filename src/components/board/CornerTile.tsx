import { BoardRow } from "@/types/Board";
import { CornerGameTile, isJail, isVacation } from "@ziv-carmi/monopoly-utils";
import JailTile from "./JailTile";
import Tile from "./Tile";
import VacationTile from "./VacationTile";

export type CornerTileProps = {
  tile: CornerGameTile;
  rowSide: BoardRow;
};

const CornerTile = (props: CornerTileProps) => {
  return isJail(props.tile) ? (
    <JailTile {...props} />
  ) : isVacation(props.tile) ? (
    <VacationTile {...props} />
  ) : (
    <Tile className="justify-center items-center" {...props} />
  );
};

export default CornerTile;
