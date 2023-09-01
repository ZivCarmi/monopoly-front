import { TileTypes } from "./Board";

export enum ChanceCardTypes {
  PAYMENT = "PAYMENT",
  GROUP_PAYMENT = "GROUP_PAYMENT",
  ADVANCE_TO_TILE = "ADVANCE_TO_TILE",
  ADVANCE_TO_TILE_TYPE = "ADVANCE_TO_TILE_TYPE",
  WALK = "WALK",
  GO_TO_JAIL = "GO_TO_JAIL",
}

export enum PaymentTypes {
  EARN = "EARN",
  PAY = "PAY",
}

class ChanceCard implements BasicChanceCard {
  message: string;

  constructor(props: BasicChanceCard) {
    this.message = props.message;
  }
}

export class PaymentCard extends ChanceCard implements IPaymentChanceCard {
  type: ChanceCardTypes.PAYMENT | ChanceCardTypes.GROUP_PAYMENT;
  event: {
    paymentType: PaymentTypes;
    amount: number;
  };

  constructor(props: PaymentChanceCardProps) {
    super({ message: props.message });
    this.type = props.type;
    this.event = props.event;
  }
}

export class AdvancedToTileCard
  extends ChanceCard
  implements IAdvancedToTileChanceCard
{
  type: ChanceCardTypes.ADVANCE_TO_TILE;
  event: {
    tileIndex: number;
    shouldGetGoReward: boolean;
  };

  constructor(props: AdvancedToTileProps) {
    super({ message: props.message });
    this.type = ChanceCardTypes.ADVANCE_TO_TILE;
    this.event = props.event;
  }
}

export class AdvancedToTileTypeCard
  extends ChanceCard
  implements IAdvancedToTileTypeChanceCard
{
  type: ChanceCardTypes.ADVANCE_TO_TILE_TYPE;
  event: {
    tileType: TileTypes.AIRPORT | TileTypes.COMPANY;
  };

  constructor(props: AdvancedToTileTypeProps) {
    super({
      message: props.message,
    });
    this.type = ChanceCardTypes.ADVANCE_TO_TILE_TYPE;
    this.event = props.event;
  }
}

export class WalkCard extends ChanceCard implements IWalkChanceCard {
  type: ChanceCardTypes.WALK;
  event: {
    steps: number;
  };

  constructor(props: WalkProps) {
    super({
      message: props.message,
    });
    this.type = ChanceCardTypes.WALK;
    this.event = props.event;
  }
}

export class GoToJail extends ChanceCard {
  type: ChanceCardTypes.GO_TO_JAIL;

  constructor(props: GoToJailProps) {
    super({
      message: props.message,
    });
    this.type = ChanceCardTypes.GO_TO_JAIL;
  }
}

export type GameChanceCard =
  | PaymentCard
  | AdvancedToTileCard
  | AdvancedToTileTypeCard
  | WalkCard
  | GoToJail;

type BasicChanceCard = {
  message: string;
};

export interface IPaymentEvent {
  paymentType: PaymentTypes;
  amount: number;
}
interface IPaymentChanceCard {
  type: ChanceCardTypes.PAYMENT | ChanceCardTypes.GROUP_PAYMENT;
  event: IPaymentEvent;
}
type PaymentChanceCardProps = BasicChanceCard & IPaymentChanceCard;

interface IAdvancedToTileChanceCard {
  event: {
    tileIndex: number;
    shouldGetGoReward: boolean;
  };
}
type AdvancedToTileProps = BasicChanceCard & IAdvancedToTileChanceCard;

interface IAdvancedToTileTypeChanceCard {
  event: {
    tileType: TileTypes.AIRPORT | TileTypes.COMPANY;
  };
}
type AdvancedToTileTypeProps = BasicChanceCard & IAdvancedToTileTypeChanceCard;

interface IWalkChanceCard {
  event: {
    steps: number;
  };
}
type WalkProps = BasicChanceCard & IWalkChanceCard;

type GoToJailProps = BasicChanceCard;

export default {
  PaymentCard,
  AdvancedToTileCard,
  AdvancedToTileTypeCard,
  WalkCard,
  GoToJail,
};
