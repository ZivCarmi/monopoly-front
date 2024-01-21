import { Socket } from "socket.io";
import Player, { NewPlayer } from "../api/types/Player";
import {
  checkForWinner,
  deleteRoom,
  getPlayersCount,
  getSocketRoomId,
  updateHostId,
  writeLogToRoom,
} from "../utils/game-utils";
import { PLAYER_MONEY } from "../config";
import { rooms, switchTurn } from "./gameController";
import io from "../services/socketService";
import { RentIndexes, isProperty, isPurchasable } from "../api/types/Board";

export function addPlayer(socket: Socket, player: NewPlayer) {
  const roomId = getSocketRoomId(socket);

  console.log(roomId);

  if (!roomId) {
    return socket.emit("player_create_error", {
      error: "Could not create player",
    });
  }

  const joinedMessage = `${player.name} נכנס למשחק`;

  const newPlayer: Player = {
    ...player,
    money: PLAYER_MONEY,
    tilePos: 0,
    properties: [],
    bankrupted: false,
  };

  // add the player
  rooms[roomId].players[newPlayer.id] = newPlayer;

  socket.emit("player_created");

  io.in(roomId).emit("update_players", {
    players: rooms[roomId].players,
    message: joinedMessage,
  });

  writeLogToRoom(roomId, joinedMessage);
}

export function playerDisconnecting(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  const roomPlayersCount = getPlayersCount(roomId);
  const connectedSockets = io.sockets.adapter.rooms.get(roomId);
  let leaveMessage = "";

  if (rooms[roomId].players[socket.id] !== undefined) {
    leaveMessage = `${rooms[roomId].players[socket.id].name} עזב את המשחק`;
  } else {
    leaveMessage = "צופה עזב את המשחק";
  }

  writeLogToRoom(roomId, leaveMessage);

  if (
    (connectedSockets && connectedSockets.size === 1) ||
    (roomPlayersCount <= 1 && rooms[roomId]?.players[socket.id])
  ) {
    deleteRoom(socket);
  } else {
    const roomHostId = updateHostId(socket);

    // Decrease room participants count by 1
    delete rooms[roomId].players[socket.id];

    socket.to(roomId).emit("update_players", {
      players: rooms[roomId].players,
      message: leaveMessage,
      roomHostId,
    });

    socket.leave(roomId);
  }
}

export function bankruptPlayer(socket: Socket) {
  const roomId = getSocketRoomId(socket);
  const player = rooms[roomId]?.players[socket.id];

  if (!roomId || !player) return;

  if (rooms[roomId].currentPlayerTurnId === socket.id) {
    switchTurn(socket);
  }

  delete rooms[roomId].players[socket.id];
  rooms[roomId].participants[socket.id].bankrupted = true;
  rooms[roomId].map.board = rooms[roomId].map.board.map((tile) => {
    if (isPurchasable(tile) && tile.owner === socket.id) {
      tile.owner = null;

      if (isProperty(tile)) {
        tile.rentIndex = RentIndexes.BLANK;
      }
    }

    return tile;
  });

  io.in(roomId).emit("player_bankrupted", {
    playerId: socket.id,
    message: `${player.name} פשט את הרגל`,
  });

  const winnerId = checkForWinner(roomId);

  if (winnerId) {
    io.in(roomId).emit("game_ended", {
      winnerId,
    });
  }
}

export function setOvercharge(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  if (rooms[roomId].currentPlayerTurnId !== socket.id) return;

  const player = rooms[roomId].players[socket.id];

  if (player.money >= 0) return;

  if (player.properties.length === 0) {
    return bankruptPlayer(socket);
  }

  socket.emit("on_overcharge");
}
