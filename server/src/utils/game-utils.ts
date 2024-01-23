import { Socket } from "socket.io";
import { rooms } from "../controllers/gameController";
import io from "../services/socketService";
import { TileTypes, isPurchasable } from "../api/types/Board";
import { DICE_OPTIONS } from "../api/constants";
import { TradeType } from "../api/types/Game";

export const getSocketRoomId = (socket: Socket): string => {
  const socketRooms = Array.from(socket.rooms.values()).filter(
    (r) => r !== socket.id
  );
  const roomId = socketRooms && socketRooms[0];

  return roomId;
};

export const getPlayerIds = (roomId: string) => {
  if (!rooms[roomId]) return [];

  return Object.keys(rooms[roomId].players);
};

export const getPlayersCount = (roomId: string) => {
  return getPlayerIds(roomId).length;
};

export const checkForWinner = (roomId: string): string => {
  if (!rooms[roomId]) return "";

  const playerIds = getPlayerIds(roomId);

  return playerIds.length === 1 ? playerIds[0] : "";
};

export const deleteRoom = (socket: Socket) => {
  const roomId = getSocketRoomId(socket);

  socket.broadcast.to(roomId).emit("room_deleted");

  io.in(roomId).socketsLeave(roomId);

  delete rooms[roomId];
};

export function writeLogToRoom(roomId: string, message: string | string[]) {
  const room = rooms[roomId];

  if (!room) return;

  if (Array.isArray(message)) {
    for (let i = 0; i < message.length; i++) {
      rooms[roomId].logs.unshift(message[i]);
    }
  } else {
    rooms[roomId].logs.unshift(message);
  }
}

export async function backToLobby(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  console.log("-----------------------------\nBacking up to lobby...");

  socket.emit("on_lobby");

  const roomPlayersCount = getPlayersCount(roomId);
  const connectedSockets = io.sockets.adapter.rooms.get(roomId);
  let messages: string[] = [];

  if (rooms[roomId].players[socket.id] !== undefined) {
    messages.push(`${rooms[roomId].players[socket.id].name} עזב את המשחק`);
  } else {
    messages.push("צופה עזב את המשחק");
  }

  if (connectedSockets?.size === 1) {
    // Delete room
    deleteRoom(socket);
  } else {
    let roomHostId = rooms[roomId].hostId;
    const isMoreThanOnePlayer = roomPlayersCount > 1;

    // Decrease room participants count by 1
    delete rooms[roomId].players[socket.id];

    // nominate new host id for the room
    if (rooms[roomId].hostId === socket.id && isMoreThanOnePlayer) {
      roomHostId = updateHostId(socket);
      const hostPlayer = rooms[roomId].players[roomHostId];

      console.log(hostPlayer);

      messages.push(`${hostPlayer.name} מונה למארח החדר`);
    }

    socket.to(roomId).emit("update_players", {
      players: rooms[roomId].players,
      message: messages,
      roomHostId,
    });

    socket.leave(roomId);
  }

  writeLogToRoom(roomId, messages);

  console.log(
    `Left room - ${roomId} and now on lobby\n-----------------------------`
  );
}

export function updateHostId(socket: Socket, newHostId?: string): string {
  newHostId = "";
  const roomId = getSocketRoomId(socket);

  if (!rooms[roomId]) return newHostId;

  if (!newHostId) {
    const availablePlayers = getPlayerIds(roomId).filter(
      (playerId) => playerId !== socket.id
    );

    if (availablePlayers.length > 0) {
      // assign the first player from the available players in the room
      newHostId = availablePlayers[0];
    }
  }

  console.log(newHostId);

  rooms[roomId].hostId = newHostId;

  return newHostId;
}

export function isPlayerInDebt(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!rooms[roomId]) return null;

  return rooms[roomId]?.players[socket.id]?.debtTo;
}

export const hasProperties = (socket: Socket) => {
  const roomId = getSocketRoomId(socket);

  if (!rooms[roomId]) return false;

  const hasProperties = rooms[roomId].map.board.some(
    (tile) => isPurchasable(tile) && tile.owner === socket.id
  );

  console.log("in hasProperties", hasProperties);

  return hasProperties;
};

export const isPlayerHasTurn = (socket: Socket) => {
  const roomId = getSocketRoomId(socket);

  if (!rooms[roomId]) return false;

  return rooms[roomId]?.currentPlayerTurnId === socket.id;
};

export const isPlayerInJail = (socket: Socket) => {
  const roomId = getSocketRoomId(socket);

  if (!rooms[roomId]) return false;

  return (
    rooms[roomId]?.suspendedPlayers[socket.id] &&
    rooms[roomId].suspendedPlayers[socket.id].reason === TileTypes.JAIL
  );
};

export const isOwner = (socket: Socket, propertyIndex: number[] | number) => {
  const roomId = getSocketRoomId(socket);

  if (!rooms[roomId]) return false;

  // checks if every passed properties belongs to the socket
  if (Array.isArray(propertyIndex)) {
    return propertyIndex.every((propertyIdx) => {
      const property = rooms[roomId].map.board[propertyIdx];

      if (isPurchasable(property) && property.owner === socket.id) {
        return true;
      }

      return false;
    });
  }

  const property = rooms[roomId].map.board[propertyIndex];

  return isPurchasable(property) && property.owner === socket.id;
};

export const randomizeDices = () => {
  let randomizeDices = [
    DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
    DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
  ];

  return randomizeDices;
};

export const isValidTrade = (socket: Socket, trade: TradeType) => {
  const roomId = getSocketRoomId(socket);

  if (!rooms[roomId]) return false;

  const players = [trade.offeror, trade.offeree];

  // check if at least one of the players made an offer
  const isAnOffer = players.some((player) => {
    if (player.money > 0) {
      return true;
    }

    if (player.properties.length > 0) {
      return true;
    }

    return false;
  });

  // check if both players can fulfill the offer
  const IsValidPlayers = players.every((player) => {
    // check if player exist
    if (!rooms[roomId].players[player.id]) return false;

    // check if player has enough money
    if (rooms[roomId].players[player.id].money < player.money) return false;

    // check if player has all the properties
    if (!isOwner(socket, player.properties)) return false;

    return true;
  });

  return isAnOffer && IsValidPlayers;
};
