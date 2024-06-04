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
  rowSide: BoardRow;
};

const NormalTile = ({ tile, rowSide, tileIndex }: NormalTileProps) => {
  return isPurchasable(tile) ? (
    <PurchasableTile tile={tile} rowSide={rowSide} />
  ) : isCard(tile) ? (
    <Tile tile={tile} rowSide={rowSide} className="justify-between relative">
      <GameCard tileIndex={tileIndex} rowSide={rowSide} />
    </Tile>
  ) : (
    <Tile tile={tile} rowSide={rowSide} />
  );
};

export default NormalTile;
