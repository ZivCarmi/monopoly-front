import {
  TradeType,
  cycleNextItem,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { Socket } from "socket.io";
import io from "../services/socketService";
import {
  getSocketRoomId,
  isValidTrade,
  writeLogToRoom,
} from "../utils/game-utils";
import { rooms } from "./gameController";

export function createTrade(socket: Socket, trade: TradeType) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  if (!roomId || !isValidTrade(socket, trade)) return;

  // check if offeror is the socket
  if (trade.offeror.id !== socket.id) return;

  trade.turn = trade.offeree.id;

  rooms[roomId].trades.push(trade);

  io.in(roomId).emit("created_trade", trade);
}

export function acceptTrade(socket: Socket, tradeId: string) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  console.log("sent tradeId", tradeId);

  if (!roomId) return;

  const room = rooms[roomId];
  const trade = room.trades.find((trade) => trade.id === tradeId);

  if (!trade) return;

  const offerorPlayer = room.players[trade.offeror.id];
  const offereePlayer = room.players[trade.offeree.id];
  const message = `${offerorPlayer.name} ביצע עסקה עם ${offereePlayer.name}`;

  // update trade offeror player
  const offerorPlayerProfit = -trade.offeror.money + trade.offeree.money;
  rooms[roomId].players[trade.offeror.id].money += offerorPlayerProfit;
  rooms[roomId].players[trade.offeror.id].debtTo =
    rooms[roomId].players[trade.offeror.id].money >= 0
      ? null
      : offerorPlayer.debtTo;

  // update trade offeree player
  const offereePlayerProfit = -trade.offeree.money + trade.offeror.money;
  rooms[roomId].players[trade.offeree.id].money += offereePlayerProfit;
  rooms[roomId].players[trade.offeree.id].debtTo =
    rooms[roomId].players[trade.offeree.id].money >= 0
      ? null
      : offereePlayer.debtTo;

  // NEED TO IMPROVE - could fail on one of the if's but the 2nd if will success. behaviour we want is if one of the if's fails, then both should fail.
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

  console.log(rooms[roomId].players[trade.offeror.id].money);
  console.log(rooms[roomId].players[trade.offeree.id].money);

  io.in(roomId).emit("accepted_trade", { tradeId, message });

  writeLogToRoom(roomId, message);
}

export function declineTrade(socket: Socket, tradeId: string) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  if (!roomId) return;

  rooms[roomId].trades = rooms[roomId].trades.filter(
    (trade) => trade.id !== tradeId
  );

  io.in(roomId).emit("declined_trade", { tradeId });
}

export function updateTrade(socket: Socket, trade: TradeType) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  if (!rooms[roomId]) return;

  const room = rooms[roomId];
  const tradeIndex = room.trades.findIndex((_trade) => _trade.id === trade.id);
  const foundTrade = room.trades[tradeIndex];
  const playerIds = [foundTrade.offeror.id, foundTrade.offeree.id];

  if (
    room.trades[tradeIndex].turn !== socket.id ||
    tradeIndex === -1 ||
    !isValidTrade(socket, trade)
  )
    return;

  trade.turn = cycleNextItem({
    currentValue: foundTrade.turn,
    array: playerIds,
  });

  rooms[roomId].trades[tradeIndex] = trade;

  io.in(roomId).emit("updated_trade", trade);
}
