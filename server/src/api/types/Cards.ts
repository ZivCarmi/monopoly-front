import { TileTypes } from "./Board";

export enum ChanceCardTypes {
  PAYMENT = "PAYMENT",
  GROUP_PAYMENT = "GROUP_PAYMENT",
  ADVANCE_TO_TILE = "ADVANCE_TO_TILE",
  ADVANCE_TO_TILE_TYPE = "ADVANCE_TO_TILE_TYPE",
}

type GameChanceTileType =
  | ChanceCardTypes.PAYMENT
  | ChanceCardTypes.GROUP_PAYMENT
  | ChanceCardTypes.ADVANCE_TO_TILE
  | ChanceCardTypes.ADVANCE_TO_TILE_TYPE;

export enum PaymentTypes {
  EARN = "EARN",
  PAY = "PAY",
}

class ChanceCard {
  message: string;
  type: GameChanceTileType;

  constructor(props: ChanceCardProps) {
    this.message = props.message;
    this.type = props.type;
  }
}

class Payment extends ChanceCard {
  event: {
    paymentType: PaymentTypes;
    amount: number;
  };

  constructor(props: PaymentChanceCardProps) {
    super({ type: props.type, message: props.message });
    this.event = props.event;
  }
}

class AdvancedToTile extends ChanceCard {
  event: {
    tileIndex: number;
    shouldGetGoReward: boolean;
  };

  constructor(props: AdvancedToTileChanceCardProps) {
    super({ type: ChanceCardTypes.ADVANCE_TO_TILE, message: props.message });
    this.event = props.event;
  }
}

class AdvancedToTileType extends ChanceCard {
  event: {
    tileType: TileTypes;
  };

  constructor(props: AdvancedToTileTypeChanceCardProps) {
    super({
      type: ChanceCardTypes.ADVANCE_TO_TILE_TYPE,
      message: props.message,
    });
    this.event = props.event;
  }
}

type BasicChanceCard = {
  message: string;
};

type ChanceCardProps = BasicChanceCard & {
  type: ChanceCardTypes;
};

type PaymentChanceCardProps = BasicChanceCard & {
  type: ChanceCardTypes.PAYMENT | ChanceCardTypes.GROUP_PAYMENT;
  event: {
    paymentType: PaymentTypes;
    amount: number;
  };
};

type AdvancedToTileChanceCardProps = BasicChanceCard & {
  event: {
    tileIndex: number;
    shouldGetGoReward: boolean;
  };
};

type AdvancedToTileTypeChanceCardProps = BasicChanceCard & {
  event: {
    tileType: TileTypes.AIRPORT | TileTypes.COMPANY;
  };
};

export type GameChanceCard = Payment | AdvancedToTile | AdvancedToTileType;

export default {
  Payment,
  AdvancedToTile,
  AdvancedToTileType,
};

// type ChanceCard = {
//   message: string;
// };

// type PaymentChanceCard = ChanceCard & {
//   event: {
//     type: ChanceCardType.PAYMENT;
//     paymentType: PaymentTypes;
//     amount: number;
//   };
// };

// type GroupPaymentChanceCard = ChanceCard & {
//   event: {
//     type: ChanceCardType.GROUP_PAYMENT;
//     paymentType: PaymentTypes;
//     amount: number;
//   };
// };

// type AdvancedToTileChanceCard = ChanceCard & {
//   event: {
//     type: ChanceCardType.ADVANCE_TO_TILE;
//     tileIndex: number;
//     shouldGetGoReward: boolean;
//   };
// };

// type AdvancedToTileTypeChanceCard = ChanceCard & {
//   event: {
//     type: ChanceCardType.ADVANCE_TO_TILE_TYPE;
//     tileType: TileTypes.AIRPORT | TileTypes.COMPANY;
//   };
// };

// type GameChanceCard =
//   | PaymentChanceCard
//   | GroupPaymentChanceCard
//   | AdvancedToTileChanceCard
//   | AdvancedToTileTypeChanceCard;
