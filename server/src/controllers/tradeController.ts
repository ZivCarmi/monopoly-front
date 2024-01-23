import { Socket } from "socket.io";
import { TradeType } from "../api/types/Game";
import {
  getSocketRoomId,
  isValidTrade,
  writeLogToRoom,
} from "../utils/game-utils";
import { rooms } from "./gameController";
import io from "../services/socketService";
import { isPurchasable } from "../api/types/Board";
import { cycleNextItem } from "../api/utils";

export function createTrade(socket: Socket, trade: TradeType) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  if (!roomId || !isValidTrade(socket, trade)) return;

  // check if offeror is the socket
  if (trade.offeror.id !== socket.id) return;

  trade.turn = trade.offeree.id;

  rooms[roomId].trades.push(trade);

  io.in(roomId).emit("trade_created", trade);
}

export function acceptTrade(socket: Socket, tradeId: string) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  console.log("sent tradeId", tradeId);

  if (!roomId) return;

  const room = rooms[roomId];
  const trade = room.trades.find((trade) => trade.id === tradeId);

  if (!trade) return null;

  const message = `${room.players[trade.offeror.id].name} ביצע עסקה עם ${
    room.players[trade.offeree.id].name
  }`;
  const fromPlayerProfit = -trade.offeror.money + trade.offeree.money;

  // update trade creator player
  rooms[roomId].players[trade.offeror.id].money += fromPlayerProfit;

  const toPlayerProfit = -trade.offeree.money + trade.offeror.money;

  // update trade recieved player
  rooms[roomId].players[trade.offeree.id].money += toPlayerProfit;

  rooms[roomId].map.board.map((tile, tileIndex) => {
    if (isPurchasable(tile) && tile.owner) {
      // check if from player is owner & tile is on his offer
      if (
        tile.owner === trade.offeror.id &&
        trade.offeror.properties.includes(tileIndex)
      ) {
        tile.owner = trade.offeree.id;
      }

      // check if to player is owner & tile is on his offer
      if (
        tile.owner === trade.offeree.id &&
        trade.offeree.properties.includes(tileIndex)
      ) {
        tile.owner = trade.offeror.id;
      }
    }

    return tile;
  });

  // console.log(rooms[roomId].map.board);
  console.log(rooms[roomId].players[trade.offeror.id].money);
  console.log(rooms[roomId].players[trade.offeree.id].money);

  io.in(roomId).emit("trade_accepted", {
    tradeId,
    message,
  });

  writeLogToRoom(roomId, message);
}

export function declineTrade(socket: Socket, tradeId: string) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  if (!roomId) return;

  rooms[roomId].trades = rooms[roomId].trades.filter(
    (trade) => trade.id !== tradeId
  );

  io.in(roomId).emit("trade_declined", {
    tradeId,
  });
}

export function updateTrade(socket: Socket, trade: TradeType) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  if (!rooms[roomId]) return;

  const room = rooms[roomId];
  const tradeIndex = room.trades.findIndex((_trade) => _trade.id === trade.id);
  const playerTurnInTrade = room.trades[tradeIndex].turn;
  const foundTrade = room.trades[tradeIndex];
  const playerIds = [foundTrade.offeror.id, foundTrade.offeree.id];

  if (playerTurnInTrade !== socket.id) return;

  if (tradeIndex === -1 || !isValidTrade(socket, trade)) return;

  trade.turn = cycleNextItem({
    currentValue: foundTrade.turn,
    array: playerIds,
  });

  rooms[roomId].trades[tradeIndex] = trade;

  io.in(roomId).emit("trade_updated", trade);
}
