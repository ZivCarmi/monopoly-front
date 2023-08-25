import { GameTile } from "@backend/types/Board";

export const isProperty = (tile: GameTile) => {
  if (
    tile.type === "property" ||
    tile.type === "company" ||
    tile.type === "airport"
  ) {
    return true;
  }

  return false;
};
