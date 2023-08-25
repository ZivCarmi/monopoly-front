export interface ITile {
  position: number;
  name: string;
}

export interface IProperty extends ITile {
  type: "property";
  cost: number;
  color: string;
  rent: number[];
  rentIndex: number;
  houseCost: number;
  hotelCost: number;
  owner: string | null;
}

export interface IAirport extends ITile {
  type: "airport";
  cost: number;
  owner: string | null;
}

export interface ICompany extends ITile {
  type: "company";
  cost: number;
  owner: string | null;
}

export interface ITax extends ITile {
  type: "tax";
  taxRate: number;
}

export interface IChance extends ITile {
  type: "chance";
}

export interface ISurprise extends ITile {
  type: "surprise";
}

export interface IGo extends ITile {
  type: "go";
}

export interface IJail extends ITile {
  type: "jail";
  suspendedPlayers: { [playerId: string]: number };
  suspensionAmount: number;
}

export interface IVacation extends ITile {
  type: "vacation";
  suspendedPlayers: { [playerId: string]: number };
  suspensionAmount: number;
}

export interface IGoToJail extends ITile {
  type: "go-to-jail";
}

type Board = GameTile[];

// type Board = [
//   IGo,
//   IProperty,
//   IChance,
//   IProperty,
//   ITax,
//   IAirport,
//   IProperty,
//   ISurprise,
//   IProperty,
//   IProperty,
//   IJail,
//   IProperty,
//   ICompany,
//   IProperty,
//   IProperty,
//   IAirport,
//   IProperty,
//   IChance,
//   IProperty,
//   IProperty,
//   IVacation,
//   IProperty,
//   ISurprise,
//   IProperty,
//   IProperty,
//   IAirport,
//   IProperty,
//   IProperty,
//   ICompany,
//   IProperty,
//   IGoToJail,
//   IProperty,
//   IProperty,
//   IChance,
//   IProperty,
//   IAirport,
//   ISurprise,
//   IProperty,
//   ICompany,
//   IProperty
// ];

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

export type PurchasableTile = IProperty | IAirport | ICompany;

export default Board;
