import { IndustryTileTypes } from "../types/Board";
import {
  AdvancedToTileProps,
  AdvancedToTileTypeProps,
  BasicGameCard,
  GameCardTypes,
  GoToJailProps,
  IAdvancedToTileGameCard,
  IAdvancedToTileTypeGameCard,
  IPaymentGameCard,
  IWalkGameCard,
  PaymentGameCardProps,
  PaymentTypes,
  WalkProps,
} from "../types/Cards";

class GameCard implements BasicGameCard {
  message: string;

  constructor(props: BasicGameCard) {
    this.message = props.message;
  }
}

export class PaymentCard extends GameCard implements IPaymentGameCard {
  type: GameCardTypes.PAYMENT | GameCardTypes.GROUP_PAYMENT;
  event: {
    paymentType: PaymentTypes;
    amount: number;
  };

  constructor(props: PaymentGameCardProps) {
    super({ message: props.message });
    this.type = props.type;
    this.event = props.event;
  }
}

export class AdvancedToTileCard
  extends GameCard
  implements IAdvancedToTileGameCard
{
  type: GameCardTypes.ADVANCE_TO_TILE;
  event: {
    tileIndex: number;
    shouldGetGoReward: boolean;
  };

  constructor(props: AdvancedToTileProps) {
    super({ message: props.message });
    this.type = GameCardTypes.ADVANCE_TO_TILE;
    this.event = props.event;
  }
}

export class AdvancedToTileTypeCard
  extends GameCard
  implements IAdvancedToTileTypeGameCard
{
  type: GameCardTypes.ADVANCE_TO_TILE_TYPE;
  event: {
    tileType: IndustryTileTypes;
  };

  constructor(props: AdvancedToTileTypeProps) {
    super({
      message: props.message,
    });
    this.type = GameCardTypes.ADVANCE_TO_TILE_TYPE;
    this.event = props.event;
  }
}

export class WalkCard extends GameCard implements IWalkGameCard {
  type: GameCardTypes.WALK;
  event: {
    steps: number;
  };

  constructor(props: WalkProps) {
    super({
      message: props.message,
    });
    this.type = GameCardTypes.WALK;
    this.event = props.event;
  }
}

export class GoToJailCard extends GameCard {
  type: GameCardTypes.GO_TO_JAIL;

  constructor(props: GoToJailProps) {
    super({
      message: props.message,
    });
    this.type = GameCardTypes.GO_TO_JAIL;
  }
}

export default {
  PaymentCard,
  AdvancedToTileCard,
  AdvancedToTileTypeCard,
  WalkCard,
  GoToJailCard,
};
