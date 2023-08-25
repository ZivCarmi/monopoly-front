import Player from "./Player";
import Board from "./Board";
import { SuspensionReasons } from "./Game";

export type Room = {
  id: string;
  players: { [playerId: string]: Player };
  map: {
    board: Board;
    chances: {
      cards: {}[]; // temp empty object
      currentIndex: number;
    };
    goRewards: {
      pass: number;
      land: number;
    };
  };
  participantsCount: number;
  gameStarted: boolean;
  hostId: string;
  dices: number[];
  currentPlayerTurnId: string | null;
  doublesInARow: number;
  suspendedPlayers: {
    [playerId: string]: {
      reason: SuspensionReasons;
      left: number;
    };
  };
  logs: string[];
};
