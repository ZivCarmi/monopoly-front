import { Server, Socket } from "socket.io";
import Player, { NewPlayer } from "../api/types/Player";
import Room from "../api/classes/Room";
import {
  IJail,
  ITax,
  PurchasableTile,
  RentIndexes,
  TileTypes,
  isAirport,
  isCompany,
  isGo,
  isGoToJail,
  isJail,
  isProperty,
  isPurchasable,
  isTax,
  isVacation,
} from "../api/types/Board";
import {
  AIRPORT_RENTS,
  COMPANY_RENTS,
  DICE_OPTIONS,
  PAY_OUT_FROM_JAIL_AMOUNT,
} from "../api/constants";
import {
  advanceToTileGameCard,
  advanceToTileTypeGameCard,
  getCityLevelText,
  getJailTileIndex,
  hasBuildings,
  hasMonopoly,
  paymentGameCard,
} from "../api/helpers";
import { shuffleArray, cycleNextItem, cyclicRangeNumber } from "../api/utils";
import { GameCardTypes, GameCard } from "../api/types/Cards";
import { RoomGameCards } from "../api/types/Room";

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

      // FOR TESTING
      // const testMap = room.map.board.map((tile) => {
      //   if (isProperty(tile)) {
      //     tile.owner = socket.id;
      //   }

      //   return tile;
      // });

      // this.rooms[roomId].map.board = testMap;
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
    };

    // add the player
    this.rooms[gameRoom].players[newPlayer.id] = newPlayer;

    io.in(gameRoom).emit("player_created", {
      player: newPlayer,
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

    if (socket.id !== this.rooms[gameRoom].hostId || players.length < 2) return;

    // randomize the players array (IF COMMENTED IT'S FOR TESTING)
    // shuffleArray(players);

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
    const board = this.rooms[roomId].map.board;
    const payingPlayer = this.rooms[roomId].players[payerId];
    const owner = tile.owner && this.rooms[roomId].players[tile.owner];
    let rentAmount: number = 0;

    if (!owner) return;

    if (isProperty(tile)) {
      const doubleRent =
        !hasBuildings(board, tile.country.id) &&
        hasMonopoly(board, tile.country.id);

      rentAmount = doubleRent ? tile.rent[0] * 2 : tile.rent[tile.rentIndex];
    } else if (isAirport(tile)) {
      const ownedAirportsCount = board.filter(
        (_tile) => isAirport(_tile) && _tile.owner === owner.id
      ).length;

      rentAmount = AIRPORT_RENTS[ownedAirportsCount - 1];
    } else if (isCompany(tile)) {
      const ownedCompaniesCount = board.filter(
        (_tile) => isCompany(_tile) && _tile.owner === owner.id
      ).length;
      const rentIndexAmount = COMPANY_RENTS[ownedCompaniesCount - 1];

      rentAmount = Math.ceil((payingPlayer.money * rentIndexAmount) / 100);
    }

    this.rooms[roomId].players[payerId].money = payingPlayer.money - rentAmount;
    this.rooms[roomId].players[owner.id].money += rentAmount;

    this.writeLogToRoom(
      roomId,
      `${payingPlayer.name} שילם שכירות בסך $${rentAmount} לידי ${owner.name}`
    );
  }

  private payTax(roomId: string, payerId: string, tile: ITax) {
    const payingPlayer = this.rooms[roomId].players[payerId];
    const taxAmount = Math.ceil((payingPlayer.money * tile.taxRate) / 100);

    this.rooms[roomId].players[payerId].money -= taxAmount;
  }

  private onPlayerLanding(roomId: string, playerId: string) {
    const room = this.rooms[roomId];
    const currentPlayerPosition = room.players[playerId].tilePos;
    const landedTile = room.map.board[currentPlayerPosition];
    const playerName = room.players[playerId].name;
    const goRewardOnLand = room.map.goRewards.land;

    if (isGo(landedTile)) {
      this.rooms[roomId].players[playerId].money += goRewardOnLand;

      this.writeLogToRoom(
        roomId,
        `${playerName} נחת על ${landedTile.name} והרוויח $${goRewardOnLand}`
      );
    } else if (isPurchasable(landedTile)) {
      if (landedTile.owner && landedTile.owner !== playerId) {
        this.payRent(roomId, playerId, landedTile);
      }
    } else if (landedTile.type === TileTypes.CHANCE) {
      this.handleGameCard(roomId, playerId, room.map.chances);
      this.rooms[roomId].map.chances.currentIndex += 1;
    } else if (isTax(landedTile)) {
      this.payTax(roomId, playerId, landedTile);
    } else if (landedTile.type === TileTypes.SURPRISE) {
      this.handleGameCard(roomId, playerId, room.map.surprises);
      this.rooms[roomId].map.surprises.currentIndex += 1;
    } else if (isJail(landedTile)) {
      // Maybe do here something? not sure
    } else if (isVacation(landedTile)) {
      this.rooms[roomId].suspendedPlayers[playerId] = {
        reason: TileTypes.VACATION,
        left: landedTile.suspensionAmount,
      };

      this.writeLogToRoom(roomId, `${playerName} יצא לחופשה`);
    } else if (isGoToJail(landedTile)) {
      this.sendPlayerToJail(roomId, playerId);
    }

    console.log(
      "Player state after landing",
      this.rooms[roomId].players[playerId]
    );
  }

  public sendPlayerToJail(roomId: string, playerId: string) {
    const room = this.rooms[roomId];

    if (!room) {
      console.log("Room not found in sendPlayerToJail");
      return;
    }

    const jailTileIndex = getJailTileIndex(room.map.board);
    const jailTile = room.map.board[jailTileIndex] as IJail;

    if (!jailTile) return;

    this.rooms[roomId].players[playerId].tilePos = jailTileIndex;
    this.rooms[roomId].suspendedPlayers[playerId] = {
      reason: TileTypes.JAIL,
      left: jailTile.suspensionAmount,
    };
  }

  private handleGameCard = (
    roomId: string,
    playerId: string,
    roomGameCards: RoomGameCards
  ) => {
    const room = this.rooms[roomId];
    const player = this.rooms[roomId].players[playerId];
    const drawnGameCard: GameCard = cycleNextItem(
      roomGameCards.currentIndex,
      roomGameCards.cards
    );

    if (!room || !player) {
      console.log("Player not found on handleGameCard");
      return;
    }

    switch (drawnGameCard.type) {
      case GameCardTypes.PAYMENT:
      case GameCardTypes.GROUP_PAYMENT:
        this.rooms[roomId].players = paymentGameCard(
          player.id,
          drawnGameCard,
          room
        );

        return;
      case GameCardTypes.ADVANCE_TO_TILE:
        this.rooms[roomId].players[playerId] = advanceToTileGameCard(
          player.id,
          drawnGameCard,
          room
        );

        return this.onPlayerLanding(roomId, playerId);
      case GameCardTypes.ADVANCE_TO_TILE_TYPE:
        this.rooms[roomId].players[playerId] = advanceToTileTypeGameCard(
          player.id,
          drawnGameCard,
          room
        );

        return this.onPlayerLanding(roomId, playerId);
      case GameCardTypes.WALK:
        return this.walkPlayer(roomId, playerId, drawnGameCard.event.steps);
      case GameCardTypes.GO_TO_JAIL:
        return this.sendPlayerToJail(roomId, playerId);
      default:
        return;
    }
  };

  public purchaseProperty(io: Server, socket: Socket, propertyIndex: number) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");
    console.log("Player attempting to purchase...");

    if (!gameRoom) return;

    const room = this.rooms[gameRoom];
    const player = room.players[socket.id];
    const tile = room.map.board[propertyIndex];

    console.log("Attempted player:", player, "Attempted Tile:", tile);

    if (propertyIndex !== player.tilePos) {
      console.log(
        "propertyIndex from client is not in sync with player position on server."
      );
      return;
    }

    if (room.currentPlayerTurnId !== socket.id) return;

    if (!isPurchasable(tile)) return;

    if (tile.owner || player.money < tile.cost) return;

    const purchaseMessage = `${player.name} רכש את ${tile.name}`;

    // update player
    this.rooms[gameRoom].players[socket.id].money -= tile.cost;

    // update board
    tile.owner = player.id;
    this.rooms[gameRoom].map.board[propertyIndex] = tile;

    console.log(this.rooms[gameRoom].map.board[propertyIndex]);
    console.log(this.rooms[gameRoom].players[socket.id]);

    io.in(gameRoom).emit("purchased_property", {
      propertyIndex,
      message: purchaseMessage,
    });

    this.writeLogToRoom(gameRoom, purchaseMessage);
  }

  public sellProperty(io: Server, socket: Socket, propertyIndex: number) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");
    console.log("Player attempting to sell property...");

    if (!gameRoom) return;

    const room = this.rooms[gameRoom];
    const player = room.players[socket.id];
    const tile = room.map.board[propertyIndex];

    console.log("Attempted player:", player, "Attempted Tile:", tile);

    if (room.currentPlayerTurnId !== socket.id) return;

    if (!isPurchasable(tile)) return;

    if (tile.owner !== socket.id || room.suspendedPlayers[socket.id]) return;

    const purchaseMessage = `${player.name} מכר את ${tile.name}`;

    // update player
    this.rooms[gameRoom].players[socket.id].money += tile.cost / 2;

    // update board
    tile.owner = null;
    this.rooms[gameRoom].map.board[propertyIndex] = tile;

    console.log(this.rooms[gameRoom].map.board[propertyIndex]);
    console.log(this.rooms[gameRoom].players[socket.id]);

    io.in(gameRoom).emit("sold_property", {
      propertyIndex,
      message: purchaseMessage,
    });

    this.writeLogToRoom(gameRoom, purchaseMessage);
  }

  public rollDice(io: Server, socket: Socket) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");

    if (!gameRoom) return;

    const currentPlayerTurnId = this.rooms[gameRoom].currentPlayerTurnId;

    if (currentPlayerTurnId !== socket.id) return;

    const suspendedPlayer =
      this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId];
    let randomizeDices = [
      DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
      DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
    ];
    // let randomizeDices = [2, 1];

    const allPlayers = this.rooms[gameRoom].players;

    // test dices for first player
    // if (Object.keys(allPlayers)[0] === currentPlayerTurnId) {
    //   randomizeDices = [5, 5];
    // }

    const isDouble = randomizeDices[0] === randomizeDices[1];
    const dicesSum = randomizeDices[0] + randomizeDices[1];

    // update dices
    this.rooms[gameRoom].dices = randomizeDices;
    if (isDouble) this.rooms[gameRoom].doublesInARow++;

    io.in(gameRoom).emit("dice_rolled", {
      dices: randomizeDices,
    });

    if (suspendedPlayer && suspendedPlayer.reason === TileTypes.JAIL) {
      if (!isDouble) {
        this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId].left--;
      } else {
        delete this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId];
      }

      return this.switchTurn(io, socket);
    }

    // send player to jail
    if (this.rooms[gameRoom].doublesInARow === 3) {
      this.sendPlayerToJail(gameRoom, currentPlayerTurnId);

      return this.switchTurn(io, socket);
    }

    this.walkPlayer(gameRoom, socket.id, dicesSum);
  }

  public walkPlayer(roomId: string, playerId: string, steps: number) {
    const room = this.rooms[roomId];
    const player = room?.players[playerId];
    const { board, goRewards } = room?.map;

    if (!room) {
      console.log("Room not found on walkPlayer");
      return;
    }

    if (!player) {
      console.log("Player not found on walkPlayer");
      return;
    }

    const tileToWalk = player.tilePos + steps;
    const newPlayerPosition = cyclicRangeNumber(tileToWalk, board.length);
    const passedGo = tileToWalk > board.length && newPlayerPosition !== 0;

    this.rooms[roomId].players[playerId].tilePos = newPlayerPosition;
    this.rooms[roomId].players[playerId].money = passedGo
      ? player.money + goRewards.pass
      : player.money;

    this.onPlayerLanding(roomId, playerId);
  }

  public switchTurn(io: Server, socket: Socket): void {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");

    if (!gameRoom) return;

    const { currentPlayerTurnId, suspendedPlayers } = this.rooms[gameRoom];

    if (!currentPlayerTurnId) return;

    const playerIds = Object.keys(this.rooms[gameRoom].players);

    const nextPlayerTurnId: string = cycleNextItem(
      currentPlayerTurnId,
      playerIds
    );

    console.log(`Current player`, currentPlayerTurnId);
    console.log(`Maybe next player id`, nextPlayerTurnId);

    // update current player turn
    this.rooms[gameRoom].currentPlayerTurnId = nextPlayerTurnId;

    const nextSuspendedPlayer = suspendedPlayers[nextPlayerTurnId];

    console.log(`next suspended player`, nextSuspendedPlayer);

    // check if next player is suspended
    if (nextSuspendedPlayer) {
      if (nextSuspendedPlayer.reason === TileTypes.VACATION) {
        if (nextSuspendedPlayer.left === 0) {
          // can safely remove the player from suspension
          delete this.rooms[gameRoom].suspendedPlayers[nextPlayerTurnId];
        } else {
          this.rooms[gameRoom].suspendedPlayers[nextPlayerTurnId].left--;

          console.log(
            `Switching turns because ${nextPlayerTurnId} is on vacation`
          );

          console.log(
            "updated suspended state",
            this.rooms[gameRoom].suspendedPlayers
          );

          return this.switchTurn(io, socket);
        }
      }
    }

    // update room
    this.rooms[gameRoom].doublesInARow = 0;

    io.in(gameRoom).emit("switched_turn", {
      nextPlayerId: nextPlayerTurnId,
    });
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
      const message = `${player.name} שילם $${PAY_OUT_FROM_JAIL_AMOUNT} בשביל להשתחרר מהכלא`;

      this.rooms[gameRoom].players[socket.id].money -= PAY_OUT_FROM_JAIL_AMOUNT;

      // Remove player from suspension state
      delete this.rooms[gameRoom].suspendedPlayers[currentPlayerTurnId];

      io.in(gameRoom).emit("paid_out_of_jail", { message });

      this.writeLogToRoom(gameRoom, message);

      return this.switchTurn(io, socket);
    }
  }

  public upgradeCity(io: Server, socket: Socket, tileIndex: number) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");

    if (!gameRoom) return;

    const {
      currentPlayerTurnId,
      suspendedPlayers,
      map: { board },
    } = this.rooms[gameRoom];
    const tile = board[tileIndex];

    if (!isProperty(tile) || tile.owner !== socket.id) return;

    if (
      !hasMonopoly(board, tile.country.id) ||
      currentPlayerTurnId !== socket.id ||
      suspendedPlayers[socket.id] ||
      tile.rentIndex === RentIndexes.HOTEL
    )
      return;

    const cityLevelText = getCityLevelText(tile.rentIndex + 1);
    const player = this.rooms[gameRoom].players[socket.id];
    const message = `${player.name} שדרג ל${cityLevelText} ב${tile.name}`;

    tile.rentIndex += 1;
    this.rooms[gameRoom].map.board[tileIndex] = tile;
    this.rooms[gameRoom].players[socket.id].money -=
      tile.rentIndex === RentIndexes.FOUR_HOUSES
        ? tile.hotelCost
        : tile.houseCost;

    io.in(gameRoom).emit("city_level_change", {
      propertyIndex: tileIndex,
      changeType: "upgrade",
      message,
    });

    this.writeLogToRoom(gameRoom, message);
  }

  public downgradeCity(io: Server, socket: Socket, tileIndex: number) {
    const gameRoom = this.getSocketGameRoom(socket);

    console.log("--------------------------------------");

    if (!gameRoom) return;

    const {
      currentPlayerTurnId,
      suspendedPlayers,
      map: { board },
    } = this.rooms[gameRoom];
    const tile = board[tileIndex];

    if (!isProperty(tile) || tile.owner !== socket.id) return;

    console.log(tile.rentIndex, RentIndexes.BLANK);
    console.log(tile.rentIndex !== RentIndexes.BLANK);

    if (
      !hasMonopoly(board, tile.country.id) ||
      currentPlayerTurnId !== socket.id ||
      suspendedPlayers[socket.id] ||
      tile.rentIndex === RentIndexes.BLANK
    )
      return;

    const cityLevelText = getCityLevelText(tile.rentIndex - 1);
    const player = this.rooms[gameRoom].players[socket.id];
    const message = `${player.name} שנמך ל${cityLevelText} ב${tile.name}`;

    tile.rentIndex -= 1;
    this.rooms[gameRoom].map.board[tileIndex] = tile;
    this.rooms[gameRoom].players[socket.id].money +=
      tile.rentIndex === RentIndexes.HOTEL ? tile.hotelCost : tile.houseCost;

    io.in(gameRoom).emit("city_level_change", {
      propertyIndex: tileIndex,
      changeType: "downgrade",
      message,
    });

    this.writeLogToRoom(gameRoom, message);
  }
}

export default new GameController();
