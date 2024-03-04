import { Socket } from "socket.io";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";
import { rooms } from "./gameController";
import io from "../services/socketService";

export function getLobbyRooms(socket: Socket) {
  const lobbyRooms: LobbyRoom[] = [];

  for (const roomId in rooms) {
    const connectedSockets = io.sockets.adapter.rooms.get(roomId);

    lobbyRooms.push({
      id: rooms[roomId].id,
      players: Object.values(rooms[roomId].players),
      connectedSockets: connectedSockets?.size || 0,
      started: rooms[roomId].gameStarted,
    });
  }

  socket.emit("rooms_list", {
    rooms: lobbyRooms,
  });
}
