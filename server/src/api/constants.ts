import { CountryIds } from "./types/Board";

export const MS_TO_MOVE_ON_TILES = 250;

export const DICE_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

export const AIRPORT_RENTS = [25, 50, 100, 200] as const;

export const COMPANY_RENTS = [4, 8, 12] as const;

export const PAY_OUT_FROM_JAIL_AMOUNT = 50 as const;

export const AIRPORT_TILE_COST = 200 as const;

export const COMPANY_TILE_COST = 150 as const;

export const AIRPORT_NAMES = [
  "שדה תעופה בן-גוריון",
  "שדה תעופה סידני",
  "שדה תעופה בייג'ין",
  "שדה תעופה קנדי",
] as const;

export const COMPANY_NAMES = [
  "חברת החשמל",
  "חברת המים",
  "חברת הטלפון",
] as const;

export const COUNTRIES = {
  egypt: {
    name: "מצרים",
    id: CountryIds.EGYPT,
  },
  israel: {
    name: "ישראל",
    id: CountryIds.ISRAEL,
  },
  australia: {
    name: "אוסטרליה",
    id: CountryIds.AUSTRALIA,
  },
  russia: {
    name: "רוסיה",
    id: CountryIds.RUSSIA,
  },
  china: {
    name: "סין",
    id: CountryIds.CHINA,
  },
  italy: {
    name: "איטליה",
    id: CountryIds.ITALY,
  },
  uk: {
    name: "אנגליה",
    id: CountryIds.UK,
  },
  usa: {
    name: "ארצות הברית",
    id: CountryIds.USA,
  },
} as const;
