import { SuspensionTileTypes } from "./Board";
import { GameCard } from "./Cards";

export type SuspensionProps = {
  reason: SuspensionTileTypes;
  left: number;
};

export type RoomGameCards = {
  cards: GameCard[];
  currentIndex: number;
};

export type TradeType = {
  id: string;
  turn: string;
  offeror: TradePlayer;
  offeree: TradePlayer;
};

export type TradePlayer = {
  id: string;
  money: number;
  properties: number[];
};

export interface InTradePlayer extends TradePlayer {
  maxMoney: number;
}

export type TradeStatus = "idle" | "sent" | "recieved";
