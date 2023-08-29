import { GameTile, TileTypes } from "@backend/types/Board";

export const isProperty = (tile: GameTile) => {
  if (
    tile.type === TileTypes.PROPERTY ||
    tile.type === TileTypes.AIRPORT ||
    tile.type === TileTypes.COMPANY
  ) {
    return true;
  }

  return false;
};
