import { Socket } from "socket.io";
import { rooms } from "../controllers/gameController";
import io from "../services/socketService";

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
