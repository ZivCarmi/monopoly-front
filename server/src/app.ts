import cors from "cors";
import { TradeType } from "./api/types/Game";
import {
  downgradeCity,
  payOutOfJail,
  purchaseProperty,
  rollDice,
  sellProperty,
  startGame,
  switchTurn,
  upgradeCity,
} from "./controllers/gameController";
import { getRoomData, joinRoom } from "./controllers/roomController";
import app from "./services/expressService";
import io from "./services/socketService";
import { getLobbyRooms } from "./controllers/lobbyController";
import { backToLobby } from "./utils/game-utils";
import {
  addPlayer,
  bankruptPlayer,
  playerDisconnecting,
} from "./controllers/playerController";
import {
  acceptTrade,
  createTrade,
  declineTrade,
  updateTrade,
} from "./controllers/tradeController";

app.use(cors());

app.get("/", (req, res) => res.status(200).json("Monopoly server is running"));

io.on("connection", (socket) => {
  console.log(
    `New connection: ${socket.id}, Clients count: ${io.engine.clientsCount}`
  );

  socket.on("get_room", ({ roomId }: { roomId: string }) => {
    getRoomData(socket, roomId);
  });

  socket.on("join_room", ({ roomId }: { roomId: string }) => {
    joinRoom(socket, roomId);
  });

  socket.on("get_lobby_rooms", () => {
    getLobbyRooms(socket);
  });

  socket.on("back_to_lobby", () => {
    backToLobby(socket);
  });

  socket.on("create_player", ({ player }) => {
    addPlayer(socket, player);
  });

  socket.on("disconnecting", () => {
    playerDisconnecting(socket);
  });

  socket.on("disconnect", () => {
    console.log(
      `Socket left: ${socket.id}, Clients count: ${io.engine.clientsCount}`
    );
  });

  socket.on("start_game", () => {
    startGame(socket);
  });

  socket.on("rolling_dice", () => {
    rollDice(socket);
  });

  socket.on("switch_turn", () => {
    switchTurn(socket);
  });

  socket.on("pay_out_of_jail", () => {
    payOutOfJail(socket);
  });

  socket.on(
    "purchase_property",
    ({ propertyIndex }: { propertyIndex: number }) => {
      purchaseProperty(socket, propertyIndex);
    }
  );

  socket.on("sell_property", ({ propertyIndex }: { propertyIndex: number }) => {
    sellProperty(socket, propertyIndex);
  });

  socket.on("upgrade_city", ({ tileIndex }: { tileIndex: number }) => {
    upgradeCity(socket, tileIndex);
  });

  socket.on("downgrade_city", ({ tileIndex }: { tileIndex: number }) => {
    downgradeCity(socket, tileIndex);
  });

  socket.on("trade_create", ({ trade }: { trade: TradeType }) => {
    createTrade(socket, trade);
  });

  socket.on("trade_accept", ({ tradeId }: { tradeId: string }) => {
    acceptTrade(socket, tradeId);
  });

  socket.on("trade_decline", ({ tradeId }: { tradeId: string }) => {
    declineTrade(socket, tradeId);
  });

  socket.on("trade_update", ({ trade }: { trade: TradeType }) => {
    updateTrade(socket, trade);
  });

  socket.on("player_bankrupt", () => {
    bankruptPlayer(socket);
  });
});
