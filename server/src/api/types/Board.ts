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

export interface IProperty extends ITile {
  type: TileTypes.PROPERTY;
  cost: number;
  color: string;
  rent: number[];
  rentIndex: number;
  houseCost: number;
  hotelCost: number;
  owner: string | null;
}

export interface IIndustry extends ITile {
  type: TileTypes.AIRPORT | TileTypes.COMPANY;
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
  type: TileTypes.JAIL | TileTypes.VACATION;
  suspensionAmount: number;
}

type Board = GameTile[];

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

export type GameTileType =
  | TileTypes.PROPERTY
  | TileTypes.AIRPORT
  | TileTypes.COMPANY
  | TileTypes.TAX
  | TileTypes.CHANCE
  | TileTypes.SURPRISE
  | TileTypes.GO
  | TileTypes.JAIL
  | TileTypes.VACATION
  | TileTypes.GO_TO_JAIL;

export type PurchasableTile = IProperty | IAirport | ICompany;

export default Board;
