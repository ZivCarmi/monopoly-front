import { GameTile, RentIndexes, TileTypes } from "@backend/types/Board";

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

export const getCityRentText = (rentIndex: RentIndexes) => {
  switch (rentIndex) {
    case RentIndexes.BLANK:
      return "בית אחד";
    case RentIndexes.ONE_HOUSE:
      return "שני בתים";
    case RentIndexes.TWO_HOUSES:
      return "שלושה בתים";
    case RentIndexes.THREE_HOUSES:
      return "ארבעה בתים";
    case RentIndexes.FOUR_HOUSES:
      return "מלון";
    default:
      return "שכירות";
  }
};
