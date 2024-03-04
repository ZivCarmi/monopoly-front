import {
  ICountry,
  IIndustry,
  IProperty,
  ISuspension,
  ITax,
  ITile,
  IndustryTileTypes,
  PropertyPayments,
  RentIndexes,
  SuspensionTileTypes,
  TileTypes,
} from "@ziv-carmi/monopoly-utils";

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
  country: ICountry;
  cost: number;
  rent: PropertyPayments;
  rentIndex: RentIndexes;
  owner: string | null;
  houseCost: number;
  hotelCost: number;

  constructor(props: PropertyTileProps) {
    super({
      name: props.name,
    });
    this.type = TileTypes.PROPERTY;
    this.country = props.country;
    this.cost = props.cost;
    this.rent = {
      [RentIndexes.BLANK]: props.rent[0],
      [RentIndexes.ONE_HOUSE]: props.rent[1],
      [RentIndexes.TWO_HOUSES]: props.rent[2],
      [RentIndexes.THREE_HOUSES]: props.rent[3],
      [RentIndexes.FOUR_HOUSES]: props.rent[4],
      [RentIndexes.HOTEL]: props.rent[5],
    };
    this.rentIndex = RentIndexes.BLANK;
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
  type: IndustryTileTypes;
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
  type: SuspensionTileTypes;
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
  country: ICountry;
  cost: number;
  rent: [number, number, number, number, number, number];
  houseCost: number;
  hotelCost: number;
};

type TaxTileProps = BasicTileProps & {
  taxRate: number;
};

type IndustryTileProps = BasicTileProps & {
  type: IndustryTileTypes;
  cost: number;
};

type SuspensionTileProps = BasicTileProps & {
  type: SuspensionTileTypes;
  suspensionAmount: number;
};

export default {
  Tile,
  PropertyTile,
  TaxTile,
  IndustryTile,
  SuspensionTile,
};
