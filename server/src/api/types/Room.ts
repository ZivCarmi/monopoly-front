import Player from "./Player";
import Board from "./Board";
import { SuspensionReasons } from "./Game";
import { GameChanceCard } from "./Cards";
import { initializeMap } from "../helpers";

class Room {
  id: string;
  players: { [playerId: string]: Player };
  map: {
    board: Board;
    chances: {
      cards: GameChanceCard[];
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

  constructor(roomId: string, socketId: string) {
    this.id = roomId;
    this.players = {};
    this.map = initializeMap();
    this.participantsCount = 1;
    this.gameStarted = false;
    this.hostId = socketId;
    this.dices = [1, 1];
    this.currentPlayerTurnId = null;
    this.doublesInARow = 0;
    this.suspendedPlayers = {};
    this.logs = [];
  }
}

// export type Room = {
//   id: string;
//   players: { [playerId: string]: Player };
//   map: {
//     board: Board;
//     chances: {
//       cards: {}[]; // temp empty object
//       currentIndex: number;
//     };
//     goRewards: {
//       pass: number;
//       land: number;
//     };
//   };
//   participantsCount: number;
//   gameStarted: boolean;
//   hostId: string;
//   dices: number[];
//   currentPlayerTurnId: string | null;
//   doublesInARow: number;
//   suspendedPlayers: {
//     [playerId: string]: {
//       reason: SuspensionReasons;
//       left: number;
//     };
//   };
//   logs: string[];
// };

export default Room;
