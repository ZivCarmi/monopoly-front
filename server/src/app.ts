import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import gameController from "./controllers/gameController";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

server.listen("3001", () => {
  console.log("listening on 3001");
});

io.on("connection", (socket) => {
  console.log(
    `New connection ${socket.id}, Clients count: ${io.engine.clientsCount}`
  );

  socket.on("join_game", ({ roomId }) => {
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
    gameController.playerLeaving(io, socket);
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

  socket.on("purchase_property", () => {
    gameController.purchaseProperty(io, socket);
  });

  socket.on("pay_out_of_jail", () => {
    gameController.payOutOfJail(io, socket);
  });
});
