import { BoardRow } from "@/types/Board";
import {
  NormalGameTile,
  isCard,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import GameCard from "./GameCard";
import PurchasableTile from "./PurchasableTile";
import Tile from "./Tile";

type NormalTileProps = {
  tile: NormalGameTile;
  tileIndex: number;
  rowClassName: BoardRow;
};

const NormalTile = ({ tile, rowClassName, tileIndex }: NormalTileProps) => {
  return isPurchasable(tile) ? (
    <PurchasableTile tile={tile} />
  ) : isCard(tile) ? (
    <Tile tile={tile} className="flex-col justify-between relative tileContent">
      <GameCard tileIndex={tileIndex} rowClassName={rowClassName} />
    </Tile>
  ) : (
    <Tile tile={tile} className="tileContent" />
  );
};

export default NormalTile;
