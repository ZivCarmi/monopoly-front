import Player from "../types/Player";
import { Board, SuspensionTileTypes } from "../types/Board";
import { initializeMap } from "../helpers";
import { RoomGameCards, TradeType } from "../types/Game";

class Room {
  id: string;
  players: { [playerId: string]: Player };
  map: {
    board: Board;
    chances: RoomGameCards;
    surprises: RoomGameCards;
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
      reason: SuspensionTileTypes;
      left: number;
    };
  };
  trades: TradeType[];
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
    this.trades = [];
    this.logs = [];
  }
}

export default Room;
