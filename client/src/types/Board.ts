import Player from "@backend/types/Player";

enum BoardRows {
  "top",
  "right",
  "bottom",
  "left",
}

export type BoardRow = keyof typeof BoardRows;

export type MappedPlayersByTiles = {
  [tileIndex: number]: Player[];
};

export const rowClassname: BoardRow[] = ["top", "right", "bottom", "left"];
