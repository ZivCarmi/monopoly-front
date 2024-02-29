import { GameTile } from "@backend/types/Board";
import Player from "@backend/types/Player";

enum BoardRows {
  "top",
  "right",
  "bottom",
  "left",
}

export type BoardRow = keyof typeof BoardRows;

export type RowTilesRaw = { area: BoardRow; tiles: GameTile[] };

export type BoardRaw = RowTilesRaw[];

export const rowClassname: BoardRow[] = ["top", "right", "bottom", "left"];

export type MappedPlayersByTiles = {
  [tileIndex: string]: Player[];
};
