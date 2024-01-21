import { rooms } from "./gameController";
import { Socket } from "socket.io";
import io from "../services/socketService";
import { getSocketRoomId } from "../utils/game-utils";
import Room from "../api/classes/Room";

export async function joinRoom(socket: Socket, roomId: string) {
  const connectedSockets = io.sockets.adapter.rooms.get(roomId);
  const existRoomId = getSocketRoomId(socket);

  // console.log("existRoomId", existRoomId, roomId);

  // Maximum of 6 players + 4 spectators
  if (connectedSockets && connectedSockets.size >= 10) {
    return socket.emit("room_join_error", {
      error: "Room is full, please choose another room.",
    });
  }

  if (existRoomId === roomId) {
    console.log("joining room inside if joinRom...");

    return socket.emit("room_joined");
  }

  if (existRoomId) {
    return socket.emit("room_join_error", {
      error: "Cannot join a room while on another room",
    });
  }

  let room = new Room(roomId, socket.id);

  if (rooms[roomId]) {
    // Update room
    room = rooms[roomId];

    // const playerTwoTest = {
    //   ...rooms[roomId].players[socket.id],
    //   money: 52,
    //   tilePos: 10,
    //   properties: [3, 6, 9, 12, 18, 21, 27, 13, 16],
    //   bankrupted: false,
    // };

    // rooms[roomId].players[socket.id] = playerTwoTest;

    // FOR TESTING
    // const testMap = room.map.board.map((tile) => {
    //   if (isProperty(tile)) {
    //     // tile.owner = socket.id;

    //     if (tile.country.id === CountryIds.UK) {
    //       tile.owner = socket.id;
    //     }
    //     if (tile.country.id === CountryIds.ISRAEL) {
    //       tile.owner = socket.id;
    //     }
    //     if (tile.country.id === CountryIds.ITALY) {
    //       tile.owner = socket.id;
    //     }

    //     if (tile.country.id === CountryIds.AUSTRALIA) {
    //       tile.rentIndex = RentIndexes.HOTEL;
    //       tile.owner = socket.id;
    //     }
    //   }

    //   return tile;
    // });

    // rooms[roomId].map.board = testMap;
  } else {
    // Set new room
    rooms[roomId] = room;

    // FOR TESTING
    // const playerOneTest = {
    //   ...rooms[roomId].players[socket.id],
    //   money: 504,
    //   tilePos: 8,
    //   properties: [
    //     24, 31, 38, 5, 11, 25, 32, 1, 8, 15, 26, 19, 14, 35, 39, 34,
    //   ],
    //   bankrupted: false,
    // };

    // rooms[roomId].players[socket.id] = playerOneTest;

    // const testMap = room.map.board.map((tile) => {
    //   if (isProperty(tile)) {
    //     // tile.owner = socket.id;

    //     if (tile.country.id === CountryIds.USA) {
    //       tile.owner = socket.id;
    //     }
    //     if (tile.country.id === CountryIds.RUSSIA) {
    //       tile.owner = socket.id;
    //     }
    //     if (tile.country.id === CountryIds.CHINA) {
    //       tile.owner = socket.id;
    //     }

    //     if (tile.country.id === CountryIds.EGYPT) {
    //       tile.rentIndex = RentIndexes.HOTEL;
    //       tile.owner = socket.id;
    //     } else {
    //       tile.rentIndex = RentIndexes.ONE_HOUSE;
    //     }
    //   }

    //   return tile;
    // });

    // rooms[roomId].map.board = testMap;
  }

  console.log("joining room normally joinRom...");

  await socket.join(roomId);

  socket.emit("room_joined", { room });
}

export async function getRoomData(socket: Socket, roomId: string) {
  if (!rooms[roomId]) {
    return socket.emit("room_not_available");
  }

  joinRoom(socket, roomId);
}

// export const getRoomData = (req: Request<{ id: string }>, res: Response) => {
//   const { id } = req.params;

//   if (!rooms[id]) {
//     return res.status(200).json({ room: null });
//   }

//   return res.status(200).json({ room: rooms[id] });
// };
