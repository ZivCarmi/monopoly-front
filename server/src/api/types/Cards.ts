import {
  AdvancedToTileCard,
  AdvancedToTileTypeCard,
  GoToJailCard,
  PaymentCard,
  WalkCard,
} from "../classes/Cards";
import { IndustryTileTypes } from "./Board";

export enum GameCardTypes {
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

export type GameCard =
  | PaymentCard
  | AdvancedToTileCard
  | AdvancedToTileTypeCard
  | WalkCard
  | GoToJailCard;

export type BasicGameCard = {
  message: string;
};

export interface IPaymentEvent {
  paymentType: PaymentTypes;
  amount: number;
}
export interface IPaymentGameCard {
  type: GameCardTypes.PAYMENT | GameCardTypes.GROUP_PAYMENT;
  event: IPaymentEvent;
}
export type PaymentGameCardProps = BasicGameCard & IPaymentGameCard;

export interface IAdvancedToTileGameCard {
  event: {
    tileIndex: number;
    shouldGetGoReward: boolean;
  };
}
export type AdvancedToTileProps = BasicGameCard & IAdvancedToTileGameCard;

export interface IAdvancedToTileTypeGameCard {
  event: {
    tileType: IndustryTileTypes;
  };
}
export type AdvancedToTileTypeProps = BasicGameCard &
  IAdvancedToTileTypeGameCard;

export interface IWalkGameCard {
  event: {
    steps: number;
  };
}
export type WalkProps = BasicGameCard & IWalkGameCard;

export type GoToJailProps = BasicGameCard;
