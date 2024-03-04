import {
  Board,
  PlayersObject,
  Room,
  RoomGameCards,
  SuspensionTileTypes,
  TradeType,
} from "@ziv-carmi/monopoly-utils";
import { initializeMap } from "../utils/game-utils";

class CreateRoom implements Room {
  id: string;
  players: PlayersObject;
  participants: PlayersObject;
  map: {
    board: Board;
    chances: RoomGameCards;
    surprises: RoomGameCards;
    goRewards: {
      pass: number;
      land: number;
    };
  };
  gameStarted: boolean;
  hostId: string;
  dices: number[];
  currentPlayerTurnId: string | null;
  doublesInARow: number;
  suspendedPlayers: {
    [playerId: string]: {
      reason: SuspensionTileTypes;
      left: number;
    };
  };
  trades: TradeType[];
  logs: string[];

  constructor(roomId: string, socketId: string) {
    this.id = roomId;
    this.players = {};
    this.participants = {}; // copy of the original players for statistics
    this.map = initializeMap();
    this.gameStarted = false;
    this.hostId = socketId;
    this.dices = [1, 1];
    this.currentPlayerTurnId = null;
    this.doublesInARow = 0;
    this.suspendedPlayers = {};
    this.trades = [];
    this.logs = [];
  }
}

export default CreateRoom;
