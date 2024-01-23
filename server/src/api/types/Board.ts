export interface ITile {
  name: string;
}

export enum TileTypes {
  PROPERTY = "PROPERTY",
  AIRPORT = "AIRPORT",
  COMPANY = "COMPANY",
  TAX = "TAX",
  CHANCE = "CHANCE",
  SURPRISE = "SURPRISE",
  GO = "GO",
  JAIL = "JAIL",
  VACATION = "VACATION",
  GO_TO_JAIL = "GO_TO_JAIL",
}

export enum CountryIds {
  EGYPT = "egypt",
  ISRAEL = "israel",
  AUSTRALIA = "australia",
  RUSSIA = "russia",
  CHINA = "china",
  ITALY = "italy",
  UK = "uk",
  USA = "usa",
}

export interface ICountry {
  name: string;
  id: CountryIds;
}

export enum RentIndexes {
  BLANK,
  ONE_HOUSE,
  TWO_HOUSES,
  THREE_HOUSES,
  FOUR_HOUSES,
  HOTEL,
}

export type PropertyPayments = {
  [RentIndexes.BLANK]: number;
  [RentIndexes.ONE_HOUSE]: number;
  [RentIndexes.TWO_HOUSES]: number;
  [RentIndexes.THREE_HOUSES]: number;
  [RentIndexes.FOUR_HOUSES]: number;
  [RentIndexes.HOTEL]: number;
};

export interface IProperty extends ITile {
  type: TileTypes.PROPERTY;
  country: ICountry;
  cost: number;
  rent: PropertyPayments;
  rentIndex: RentIndexes;
  houseCost: number;
  hotelCost: number;
  owner: string | null;
}

export interface IIndustry extends ITile {
  type: IndustryTileTypes;
  cost: number;
  owner: string | null;
}

export interface IAirport extends ITile {
  type: TileTypes.AIRPORT;
  cost: number;
  owner: string | null;
}

export interface ICompany extends ITile {
  type: TileTypes.COMPANY;
  cost: number;
  owner: string | null;
}

export interface ITax extends ITile {
  type: TileTypes.TAX;
  taxRate: number;
}

export interface IChance extends ITile {
  type: TileTypes.CHANCE;
}

export interface ISurprise extends ITile {
  type: TileTypes.SURPRISE;
}

export interface IGo extends ITile {
  type: TileTypes.GO;
}

export interface IJail extends ITile {
  type: TileTypes.JAIL;
  suspensionAmount: number;
}

export interface IVacation extends ITile {
  type: TileTypes.VACATION;
  suspensionAmount: number;
}

export interface IGoToJail extends ITile {
  type: TileTypes.GO_TO_JAIL;
}

export interface ISuspension extends ITile {
  type: SuspensionTileTypes;
  suspensionAmount: number;
}

export type GameTile =
  | IProperty
  | IAirport
  | ICompany
  | ITax
  | IChance
  | ISurprise
  | IGo
  | IJail
  | IVacation
  | IGoToJail;

export type Board = GameTile[];

export type CornerTile = IGo | IJail | IVacation | IGoToJail;

export type PurchasableTile = IProperty | IAirport | ICompany;

export type IndustryTileTypes = TileTypes.AIRPORT | TileTypes.COMPANY;

export type SuspensionTileTypes = TileTypes.JAIL | TileTypes.VACATION;

export function isProperty(object: any): object is IProperty {
  return object.type === TileTypes.PROPERTY;
}

export function isAirport(object: any): object is IAirport {
  return object.type === TileTypes.AIRPORT;
}

export function isCompany(object: any): object is ICompany {
  return object.type === TileTypes.COMPANY;
}

export function isPurchasable(object: any): object is PurchasableTile {
  return isProperty(object) || isAirport(object) || isCompany(object);
}

export function isCard(object: any): object is IChance | ISurprise {
  return object.type === TileTypes.CHANCE || object.type === TileTypes.SURPRISE;
}

export function isChanceCard(object: any): object is IChance {
  return object.type === TileTypes.CHANCE;
}

export function isSurpriseCard(object: any): object is ISurprise {
  return object.type === TileTypes.SURPRISE;
}

export function isTax(object: any): object is ITax {
  return object.type === TileTypes.TAX;
}

export function isGo(object: any): object is IGo {
  return object.type === TileTypes.GO;
}

export function isJail(object: any): object is IJail {
  return object.type === TileTypes.JAIL;
}

export function isVacation(object: any): object is IVacation {
  return object.type === TileTypes.VACATION;
}

export function isGoToJail(object: any): object is IGoToJail {
  return object.type === TileTypes.GO_TO_JAIL;
}

export function isCorner(object: any): object is CornerTile {
  return (
    isGo(object) || isJail(object) || isVacation(object) || isGoToJail(object)
  );
}
