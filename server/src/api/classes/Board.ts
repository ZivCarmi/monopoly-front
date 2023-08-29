import {
  IIndustry,
  IProperty,
  ISuspension,
  ITax,
  ITile,
  TileTypes,
} from "../types/Board";

class BasicTile implements ITile {
  name: string;

  constructor(props: BasicTileProps) {
    this.name = props.name;
  }
}

export class Tile extends BasicTile implements ITile {
  type:
    | TileTypes.CHANCE
    | TileTypes.SURPRISE
    | TileTypes.GO
    | TileTypes.GO_TO_JAIL;

  constructor(props: TileProps) {
    super({ name: props.name });
    this.type = props.type;
  }
}

class PropertyTile extends BasicTile implements IProperty {
  type: TileTypes.PROPERTY;
  cost: number;
  color: string;
  rent: number[];
  rentIndex: number;
  owner: string | null;
  houseCost: number;
  hotelCost: number;

  constructor(props: PropertyTileProps) {
    super({
      name: props.name,
    });
    this.type = TileTypes.PROPERTY;
    this.cost = props.cost;
    this.color = props.color;
    this.rent = props.rent;
    this.rentIndex = 0;
    this.owner = null;
    this.houseCost = props.houseCost;
    this.hotelCost = props.hotelCost;
  }
}

class TaxTile extends BasicTile implements ITax {
  type: TileTypes.TAX;
  taxRate: number;

  constructor(props: TaxTileProps) {
    super({ name: props.name });
    this.type = TileTypes.TAX;
    this.taxRate = props.taxRate;
  }
}

export class IndustryTile extends BasicTile implements IIndustry {
  type: TileTypes.AIRPORT | TileTypes.COMPANY;
  cost: number;
  owner: string | null;

  constructor(props: IndustryTileProps) {
    super({
      name: props.name,
    });
    this.type = props.type;
    this.cost = props.cost;
    this.owner = null;
  }
}

export class SuspensionTile extends BasicTile implements ISuspension {
  type: TileTypes.JAIL | TileTypes.VACATION;
  suspensionAmount: number;

  constructor(props: SuspensionTileProps) {
    super({
      name: props.name,
    });
    this.type = props.type;
    this.suspensionAmount = props.suspensionAmount;
  }
}

type BasicTileProps = {
  name: string;
};

type TileProps = BasicTileProps & {
  type:
    | TileTypes.CHANCE
    | TileTypes.SURPRISE
    | TileTypes.GO
    | TileTypes.GO_TO_JAIL;
};

type PropertyTileProps = BasicTileProps & {
  cost: number;
  color: string;
  rent: number[];
  houseCost: number;
  hotelCost: number;
};

type TaxTileProps = BasicTileProps & {
  taxRate: number;
};

type IndustryTileProps = BasicTileProps & {
  type: TileTypes.AIRPORT | TileTypes.COMPANY;
  cost: number;
};

type SuspensionTileProps = BasicTileProps & {
  type: TileTypes.JAIL | TileTypes.VACATION;
  suspensionAmount: number;
};

export default {
  Tile,
  PropertyTile,
  TaxTile,
  IndustryTile,
  SuspensionTile,
};
