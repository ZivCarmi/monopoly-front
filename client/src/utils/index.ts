import store from "@/app/store";
import {
  CountryIds,
  IProperty,
  RentIndexes,
  TileTypes,
  isProperty,
} from "@backend/types/Board";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isPlayerSuspended = (playerId: string) => {
  const suspendedPlayer = store.getState().game.suspendedPlayers[playerId];

  return Boolean(suspendedPlayer);
};

export const isPlayerInJail = (playerId: string) => {
  const suspendedPlayer = store.getState().game.suspendedPlayers[playerId];

  if (!suspendedPlayer) return false;

  return suspendedPlayer.reason === TileTypes.JAIL;
};

export const getCities = (countryId: CountryIds) => {
  const { board } = store.getState().game.map;

  return board.filter(
    (tile): tile is IProperty =>
      isProperty(tile) && tile.country.id === countryId
  );
};

export const hasBuildings = (countryId: CountryIds) => {
  return getCities(countryId).some(
    (city) => city.rentIndex !== RentIndexes.BLANK
  );
};
