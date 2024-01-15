import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import gameController from "./controllers/gameController";
import { TradeType } from "./api/types/Game";
import { getRoomData } from "./controllers/roomController";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://localhost:4173",
      "https://socket-io-monopoly.vercel.app",
    ],
  },
});

server.listen("3001", () => {
  console.log("listening on 3001");
});

app.get("/rooms/:id", getRoomData);

io.on("connection", (socket) => {
  console.log(
    `New connection ${socket.id}, Clients count: ${io.engine.clientsCount}`
  );

  socket.on("join_game", ({ roomId }: { roomId: string }) => {
    gameController.joinRoom(io, socket, roomId);
  });

  socket.on("get_rooms", () => {
    gameController.getRooms(io, socket);
  });

  socket.on("back_to_lobby", () => {
    gameController.backToLobby(io, socket);
  });

  socket.on("create_player", ({ player }) => {
    gameController.addPlayer(io, socket, player);
  });

  socket.on("disconnecting", () => {
    gameController.playerDisconnect(io, socket);
  });

  socket.on("start_game", () => {
    gameController.startGame(io, socket);
  });

  socket.on("rolling_dice", () => {
    gameController.rollDice(io, socket);
  });

  socket.on("switch_turn", () => {
    gameController.switchTurn(io, socket);
  });

  socket.on("pay_out_of_jail", () => {
    gameController.payOutOfJail(io, socket);
  });

  socket.on(
    "purchase_property",
    ({ propertyIndex }: { propertyIndex: number }) => {
      gameController.purchaseProperty(io, socket, propertyIndex);
    }
  );

  socket.on("sell_property", ({ propertyIndex }: { propertyIndex: number }) => {
    gameController.sellProperty(io, socket, propertyIndex);
  });

  socket.on("upgrade_city", ({ tileIndex }: { tileIndex: number }) => {
    gameController.upgradeCity(io, socket, tileIndex);
  });

  socket.on("downgrade_city", ({ tileIndex }: { tileIndex: number }) => {
    gameController.downgradeCity(io, socket, tileIndex);
  });

  socket.on("create_trade", ({ trade }: { trade: TradeType }) => {
    gameController.createTrade(io, socket, trade);
  });

  socket.on("trade_accepted", ({ tradeId }: { tradeId: string }) => {
    gameController.acceptTrade(io, socket, tradeId);
  });

  socket.on("trade_declined", ({ tradeId }: { tradeId: string }) => {
    gameController.declineTrade(io, socket, tradeId);
  });

  socket.on("trade_updated", ({ trade }: { trade: TradeType }) => {
    gameController.updateTrade(io, socket, trade);
  });
});
