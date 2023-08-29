import { Server, Socket } from "socket.io";
import Player, { NewPlayer } from "../api/types/Player";
import Room from "../api/types/Room";
import { IJail, ITax, PurchasableTile, TileTypes } from "../api/types/Board";
import {
  AIRPORT_RENTS,
  COMPANY_RENTS,
  DICE_OPTIONS,
  PAY_OUT_FROM_JAIL_AMOUNT,
} from "../api/constants";
import { getJailTileIndex } from "../api/helpers";
import { shuffleArray, cycleNextItem, cyclicRangeNumber } from "../api/utils";

class GameController {
  public rooms: { [roomId: string]: Room } = {};

  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    return gameRoom;
  }

  private writeLogToRoom(roomId: string, message: string) {
    const room = this.rooms[roomId];

    if (room !== undefined) {
      this.rooms[roomId].logs.unshift(message);
    }
  }

  public async backToLobby(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    if (!gameRoom) return;

    console.log("-----------------------------\nBacking up to lobby...");

    this.playerLeaving(io, socket);

    console.log(
      `Left room - ${gameRoom} and now on lobby\n-----------------------------`
    );

    socket.emit("on_lobby");
  }

  public async getRooms(io: Server, socket: Socket) {
    socket.emit("rooms_list", {
      rooms: Object.values(this.rooms),
    });
  }

  public async joinRoom(io: Server, socket: Socket, roomId: string) {
    const connectedSockets = io.sockets.adapter.rooms.get(roomId);
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("New User joining room:", roomId);

    if (gameRoom) {
      return socket.emit("room_join_error", {
        error: "Cannot join a room while on another room",
      });
    }

    if (connectedSockets && connectedSockets.size === 4) {
      return socket.emit("room_join_error", {
        error: "Room is full, please choose another room.",
      });
    }

    let room = new Room(roomId, socket.id);

    if (this.rooms[roomId] !== undefined) {
      // Update room
      room = this.rooms[roomId];
      this.rooms[roomId].participantsCount++;
    } else {
      // Set new room
      this.rooms[roomId] = room;
    }

    await socket.join(roomId);

    socket.emit("room_joined", { room });
  }

  public addPlayer(io: Server, socket: Socket, player: NewPlayer) {
    const gameRoom = this.getSocketGameRoom(socket);

    if (!gameRoom) {
      return socket.emit("player_create_error", {
        error: "Could not create player",
      });
    }

    const joinedMessage = `${player.name} נכנס למשחק`;
    const newPlayer: Player = {
      ...player,
      money: 1000,
      tilePos: 0,
      properties: [],
    };

    // add the player
    this.rooms[gameRoom].players[newPlayer.id] = newPlayer;

    io.in(gameRoom).emit("player_created", {
      players: Object.values(this.rooms[gameRoom].players),
      message: joinedMessage,
    });

    this.writeLogToRoom(gameRoom, joinedMessage);
  }

  public playerLeaving(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    // To update the socket client
    socket.emit("left_room");

    if (!gameRoom) return;

    let leaveMessage = "";

    if (this.rooms[gameRoom].players[socket.id] !== undefined) {
      leaveMessage = `${
        this.rooms[gameRoom].players[socket.id].name
      } עזב את המשחק`;
    } else {
      leaveMessage = "צופה עזב את המשחק";
    }

    // Notify to room that the user is leaving
    socket.to(gameRoom).emit("player_left", {
      playerId: socket.id,
      message: leaveMessage,
    });

    this.writeLogToRoom(gameRoom, leaveMessage);

    if (this.rooms[gameRoom].participantsCount === 1) {
      // Delete room
      io.in(gameRoom).socketsLeave(gameRoom);

      delete this.rooms[gameRoom];
    } else {
      // Decrease room participants count by 1
      socket.leave(gameRoom);

      delete this.rooms[gameRoom].players[socket.id];

      this.rooms[gameRoom].participantsCount--;
    }
  }

  public startGame(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    if (!gameRoom) return;

    const players = Object.values(this.rooms[gameRoom].players);

    if (players.length < 2) return;

    // randomize the players array
    shuffleArray(players);

    const startingPlayer = players[0].id;
    const gameStartMessage = "המשחק התחיל!";

    this.rooms[gameRoom].gameStarted = true;
    this.rooms[gameRoom].currentPlayerTurnId = startingPlayer;

    io.in(gameRoom).emit("game_started", {
      generatedPlayers: players,
      currentPlayerTurn: startingPlayer,
      message: gameStartMessage,
    });

    this.writeLogToRoom(gameRoom, gameStartMessage);
  }

  private payRent(roomId: string, payerId: string, tile: PurchasableTile) {
    const payingPlayer = this.rooms[roomId].players[payerId];
    const owner = tile.owner && this.rooms[roomId].players[tile.owner];
    let rentAmount: number = 0;

    if (!owner) return;

    if (tile.type === TileTypes.PROPERTY) {
      rentAmount = tile.rent[tile.rentIndex];
    } else if (tile.type === TileTypes.AIRPORT) {
      const ownedAirportsCount = this.rooms[roomId].map.board.filter(
        (_tile) => _tile.type === TileTypes.AIRPORT && _tile.owner === owner.id
      ).length;

      rentAmount = AIRPORT_RENTS[ownedAirportsCount - 1];
    } else if (tile.type === TileTypes.COMPANY) {
      const ownedCompaniesCount = this.rooms[roomId].map.board.filter(
        (_tile) => _tile.type === TileTypes.COMPANY && _tile.owner === owner.id
      ).length;
      const rentIndexAmount = COMPANY_RENTS[ownedCompaniesCount - 1];

      rentAmount = Math.ceil((payingPlayer.money * rentIndexAmount) / 100);
    }

    const moneyAfterDeduction =
      this.rooms[roomId].players[payerId].money - rentAmount;

    this.rooms[roomId].players[payerId].money = moneyAfterDeduction;
    this.rooms[roomId].players[owner.id].money += rentAmount;

    this.writeLogToRoom(
      roomId,
      `${payingPlayer.name} שילם שכירות בסך $${rentAmount} לידי ${owner.name}`
    );

    if (moneyAfterDeduction < 0) {
      // budget overrun
    }
  }

  private payTax(roomId: string, payerId: string, tile: ITax) {
    const payingPlayer = this.rooms[roomId].players[payerId];
    const taxAmount = Math.ceil((payingPlayer.money * tile.taxRate) / 100);

    const moneyAfterDeduction =
      this.rooms[roomId].players[payerId].money - taxAmount;
    this.rooms[roomId].players[payerId].money -= taxAmount;

    if (moneyAfterDeduction < 0) {
      // budget overrun
    }
  }

  private onPlayerLanding(roomId: string, playerId: string) {
    const currentPlayerPosition = this.rooms[roomId].players[playerId].tilePos;
    const landedTile = this.rooms[roomId].map.board[currentPlayerPosition];
    const playerName = this.rooms[roomId].players[playerId].name;
    const goRewardOnLand = this.rooms[roomId].map.goRewards.land;

    if (landedTile.type === TileTypes.GO) {
      this.rooms[roomId].players[playerId].money += goRewardOnLand;

      this.writeLogToRoom(
        roomId,
        `${playerName} נחת על ${landedTile.name} והרוויח $${goRewardOnLand}`
      );
    } else if (
      landedTile.type === TileTypes.PROPERTY ||
      landedTile.type === TileTypes.AIRPORT ||
      landedTile.type === TileTypes.COMPANY
    ) {
      if (landedTile.owner && landedTile.owner !== playerId) {
        this.payRent(roomId, playerId, landedTile);
      }
    } else if (landedTile.type === TileTypes.CHANCE) {
      // TO-DO

      this.rooms[roomId].map.chances.currentIndex++;
    } else if (landedTile.type === TileTypes.TAX) {
      this.payTax(roomId, playerId, landedTile);
    } else if (landedTile.type === TileTypes.SURPRISE) {
      // TO-DO
    } else if (landedTile.type === TileTypes.JAIL) {
      // Maybe do here something? not sure
    } else if (landedTile.type === TileTypes.VACATION) {
      this.rooms[roomId].suspendedPlayers[playerId] = {
        reason: TileTypes.VACATION,
        left: landedTile.suspensionAmount,
      };

      this.writeLogToRoom(roomId, `${playerName} יצא לחופשה`);
    } else if (landedTile.type === TileTypes.GO_TO_JAIL) {
      const jailTileIndex = getJailTileIndex(this.rooms[roomId].map.board);
      const jailTile = this.rooms[roomId].map.board[jailTileIndex] as IJail;

      if (!jailTile) return;

      this.rooms[roomId].players[playerId].tilePos = jailTileIndex;
      this.rooms[roomId].suspendedPlayers[playerId] = {
        reason: TileTypes.JAIL,
        left: jailTile.suspensionAmount,
      };
    }

    console.log("suspended players state", this.rooms[roomId].suspendedPlayers);
  }

  public purchaseProperty(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");
    console.log("Player attempting to purchase");

    if (!gameRoom) return;

    const player = this.rooms[gameRoom].players[socket.id];
    const playerTileIndex = player.tilePos;
    const tile = this.rooms[gameRoom].map.board[playerTileIndex];

    console.log("Attempted player:", player);
    console.log("Player position:", playerTileIndex);
    console.log("Tile", tile);

    if (
      tile.type !== TileTypes.PROPERTY &&
      tile.type !== TileTypes.AIRPORT &&
      tile.type !== TileTypes.COMPANY
    )
      return;

    if (tile.owner || player.money < tile.cost) return;

    const purchaseMessage = `${player.name} רכש את ${tile.name}`;

    // update player
    this.rooms[gameRoom].players[socket.id].properties.push(playerTileIndex);
    this.rooms[gameRoom].players[socket.id].money -= tile.cost;

    // update board
    this.rooms[gameRoom].map.board[playerTileIndex] = {
      ...this.rooms[gameRoom].map.board[playerTileIndex],
      owner: player.id,
    } as PurchasableTile;

    console.log(this.rooms[gameRoom].map.board[playerTileIndex]);
    console.log(this.rooms[gameRoom].players[socket.id]);

    io.in(gameRoom).emit("purchased_property", {
      playerId: player.id,
      tileIndex: playerTileIndex,
      message: purchaseMessage,
    });

    this.writeLogToRoom(gameRoom, purchaseMessage);

    console.log("--------------------------------------");
  }

  public rollDice(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");

    if (!gameRoom) return;

    const currentPlayerTurnId = this.rooms[gameRoom].currentPlayerTurnId;

    if (currentPlayerTurnId !== socket.id) return;

    const currentPlayer = this.rooms[gameRoom].players[socket.id];
    const isSuspendedPlayer =
      this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId];
    const board = this.rooms[gameRoom].map.board;
    const jailTileIndex = getJailTileIndex(board);
    const jailTile = board[jailTileIndex] as IJail;
    // let randomizeDices = [
    //   DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
    //   DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
    // ];
    let randomizeDices = [1, 1];

    const allPlayers = this.rooms[gameRoom].players;

    // test dices for first player
    if (Object.keys(allPlayers)[0] === currentPlayerTurnId) {
      // randomizeDices = [1, 5];
    }

    const isDouble = randomizeDices[0] === randomizeDices[1];
    const dicesSum = randomizeDices[0] + randomizeDices[1];

    // update dices
    this.rooms[gameRoom].dices = randomizeDices;
    if (isDouble) this.rooms[gameRoom].doublesInARow++;

    io.in(gameRoom).emit("dice_rolled", {
      dices: randomizeDices,
    });

    if (
      isSuspendedPlayer !== undefined &&
      isSuspendedPlayer.reason === TileTypes.JAIL
    ) {
      if (!isDouble) {
        this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId].left--;
      } else {
        delete this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId];
      }

      return this.switchTurn(io, socket);
    }

    // send player to jail
    if (jailTile && this.rooms[gameRoom].doublesInARow === 3) {
      this.rooms[gameRoom].players[socket.id].tilePos = jailTileIndex;
      this.rooms[gameRoom].suspendedPlayers[socket.id] = {
        reason: TileTypes.JAIL,
        left: jailTile.suspensionAmount,
      };

      return this.switchTurn(io, socket);
    }

    const tileToWalk = currentPlayer.tilePos + dicesSum;
    const newPlayerPosition = cyclicRangeNumber(tileToWalk, board.length);
    const passedGo = tileToWalk > board.length && newPlayerPosition !== 0;

    this.rooms[gameRoom].players[socket.id].tilePos = newPlayerPosition;
    this.rooms[gameRoom].players[socket.id].money = passedGo
      ? currentPlayer.money + this.rooms[gameRoom].map.goRewards.pass
      : currentPlayer.money;

    this.onPlayerLanding(gameRoom, socket.id);

    console.log("--------------------------------------");
  }

  public switchTurn(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");

    if (!gameRoom) return;

    const { currentPlayerTurnId, suspendedPlayers } = this.rooms[gameRoom];

    if (!currentPlayerTurnId) return;

    const playerIds = Object.keys(this.rooms[gameRoom].players);

    const nextPlayerTurnId = cycleNextItem(currentPlayerTurnId, playerIds);

    console.log(`Current player`, currentPlayerTurnId);
    console.log(`Maybe next player id`, nextPlayerTurnId);

    // update current player turn
    this.rooms[gameRoom].currentPlayerTurnId = nextPlayerTurnId;

    const nextSuspendedPlayer = suspendedPlayers[nextPlayerTurnId];

    console.log(`next suspended player`, nextSuspendedPlayer);

    // check if next player is suspended
    if (nextSuspendedPlayer !== undefined) {
      if (nextSuspendedPlayer.reason === TileTypes.VACATION) {
        if (nextSuspendedPlayer.left === 0) {
          // can safely remove the player from suspension
          delete this.rooms[gameRoom].suspendedPlayers[nextPlayerTurnId];
        } else {
          this.rooms[gameRoom].suspendedPlayers[nextPlayerTurnId].left--;

          console.log(
            `Switching turns because ${nextPlayerTurnId} is suspended in vacation`
          );

          console.log(
            "updated suspended state",
            this.rooms[gameRoom].suspendedPlayers
          );

          this.switchTurn(io, socket);
          return;
        }
      }
    }

    // update room
    this.rooms[gameRoom].doublesInARow = 0;

    io.in(gameRoom).emit("switched_turn", {
      nextPlayerId: nextPlayerTurnId,
    });

    console.log("--------------------------------------");
  }

  public payOutOfJail(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");

    if (!gameRoom) return;

    const { currentPlayerTurnId, suspendedPlayers } = this.rooms[gameRoom];

    if (currentPlayerTurnId !== socket.id || !suspendedPlayers[socket.id])
      return;

    const player = this.rooms[gameRoom].players[socket.id];

    if (player.money >= PAY_OUT_FROM_JAIL_AMOUNT) {
      this.rooms[gameRoom].players[socket.id].money -= PAY_OUT_FROM_JAIL_AMOUNT;

      // Remove player from suspension state
      delete this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId];

      io.in(gameRoom).emit("paid_out_of_jail", { player });

      return this.switchTurn(io, socket);
    }
  }
}

export default new GameController();
