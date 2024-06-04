import { GameTile, Player } from "@ziv-carmi/monopoly-utils";

enum BoardRows {
  "top",
  "right",
  "bottom",
  "left",
}

export type BoardRow = keyof typeof BoardRows;

export type RowTilesRaw = { area: BoardRow; tiles: GameTile[] };

export type BoardRaw = RowTilesRaw[];

export const rowSide: BoardRow[] = ["top", "right", "bottom", "left"];

export type OppositeSide = {
  [keyof in BoardRow]: BoardRow;
};

export type MappedPlayersByTiles = {
  [tileIndex: string]: Player[];
};
