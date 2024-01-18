import Player from "../types/Player";
import { Board, SuspensionTileTypes } from "../types/Board";
import { initializeMap } from "../helpers";
import { RoomGameCards, TradeType } from "../types/Game";

type PlayersObject = { [playerId: string]: Player };

class Room {
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

export type LobbyRoom = {
  id: string;
  players: Player[];
  connectedSockets: number;
  started: boolean;
};

export default Room;
