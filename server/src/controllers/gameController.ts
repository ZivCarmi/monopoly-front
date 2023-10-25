import { Server, Socket } from "socket.io";
import Player, { NewPlayer } from "../api/types/Player";
import Room from "../api/classes/Room";
import {
  CountryIds,
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
  isValidTrade,
  paymentGameCard,
} from "../api/helpers";
import { shuffleArray, cycleNextItem, cyclicRangeNumber } from "../api/utils";
import { GameCardTypes, GameCard } from "../api/types/Cards";
import { RoomGameCards, TradeType } from "../api/types/Game";

class GameController {
  public rooms: { [roomId: string]: Room } = {};

  private getSocketRoomId(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const roomId = socketRooms && socketRooms[0];

    return roomId;
  }

  private writeLogToRoom(roomId: string, message: string) {
    const room = this.rooms[roomId];

    if (room !== undefined) {
      this.rooms[roomId].logs.unshift(message);
    }
  }

  public async backToLobby(io: Server, socket: Socket) {
    const roomId = this.getSocketRoomId(socket);

    if (!roomId) return;

    console.log("-----------------------------\nBacking up to lobby...");

    this.playerLeaving(io, socket);

    console.log(
      `Left room - ${roomId} and now on lobby\n-----------------------------`
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
    const existRoomId = this.getSocketRoomId(socket);

    console.log("New User joining room:", roomId);

    if (existRoomId) {
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

      // this.rooms[roomId].map.board = testMap;
    } else {
      // Set new room
      this.rooms[roomId] = room;

      // FOR TESTING
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

      // this.rooms[roomId].map.board = testMap;
    }

    await socket.join(roomId);

    socket.emit("room_joined", { room });
  }

  public addPlayer(io: Server, socket: Socket, player: NewPlayer) {
    const roomId = this.getSocketRoomId(socket);

    if (!roomId) {
      return socket.emit("player_create_error", {
        error: "Could not create player",
      });
    }

    const joinedMessage = `${player.name} נכנס למשחק`;
    const newPlayer: Player = {
      ...player,
      money: 1500,
      tilePos: 0,
      properties: [],
    };

    // add the player
    this.rooms[roomId].players[newPlayer.id] = newPlayer;

    io.in(roomId).emit("player_created", {
      player: newPlayer,
      message: joinedMessage,
    });

    this.writeLogToRoom(roomId, joinedMessage);
  }

  public playerLeaving(io: Server, socket: Socket) {
    const roomId = this.getSocketRoomId(socket);

    // To update the socket client
    socket.emit("left_room");

    if (!roomId) return;

    let leaveMessage = "";

    if (this.rooms[roomId].players[socket.id] !== undefined) {
      leaveMessage = `${
        this.rooms[roomId].players[socket.id].name
      } עזב את המשחק`;
    } else {
      leaveMessage = "צופה עזב את המשחק";
    }

    // Notify to room that the user is leaving
    socket.to(roomId).emit("player_left", {
      playerId: socket.id,
      message: leaveMessage,
    });

    this.writeLogToRoom(roomId, leaveMessage);

    if (this.rooms[roomId].participantsCount === 1) {
      // Delete room
      io.in(roomId).socketsLeave(roomId);

      delete this.rooms[roomId];
    } else {
      // Decrease room participants count by 1
      socket.leave(roomId);

      delete this.rooms[roomId].players[socket.id];

      this.rooms[roomId].participantsCount--;
    }
  }

  public startGame(io: Server, socket: Socket) {
    const roomId = this.getSocketRoomId(socket);

    if (!roomId) return;

    const players = Object.values(this.rooms[roomId].players);

    if (socket.id !== this.rooms[roomId].hostId || players.length < 2) return;

    // randomize the players array (IF COMMENTED IT'S FOR TESTING)
    shuffleArray(players);

    const startingPlayer = players[0].id;
    const gameStartMessage = "המשחק התחיל!";

    this.rooms[roomId].gameStarted = true;
    this.rooms[roomId].currentPlayerTurnId = startingPlayer;

    io.in(roomId).emit("game_started", {
      generatedPlayers: players,
      currentPlayerTurn: startingPlayer,
      message: gameStartMessage,
    });

    this.writeLogToRoom(roomId, gameStartMessage);
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

  private onPlayerLanding(socket: Socket) {
    const roomId = this.getSocketRoomId(socket);
    const playerId = socket.id;

    if (!roomId) return;

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
      // this.handleGameCard(roomId, playerId, room.map.chances);
      this.handleGameCard(socket, room.map.chances);
      this.rooms[roomId].map.chances.currentIndex += 1;
    } else if (isTax(landedTile)) {
      this.payTax(roomId, playerId, landedTile);
    } else if (landedTile.type === TileTypes.SURPRISE) {
      // this.handleGameCard(roomId, playerId, room.map.surprises);
      this.handleGameCard(socket, room.map.surprises);
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

    if (this.rooms[roomId].players[playerId].money < 0) {
      socket.emit("overcharged");
    }
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

  private handleGameCard = (socket: Socket, roomGameCards: RoomGameCards) => {
    const roomId = this.getSocketRoomId(socket);
    const playerId = socket.id;

    if (!roomId) return;

    const room = this.rooms[roomId];
    const player = this.rooms[roomId].players[playerId];
    const drawnGameCard = cycleNextItem({
      currentIndex: roomGameCards.currentIndex,
      array: roomGameCards.cards,
    });

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

        return this.onPlayerLanding(socket);
      case GameCardTypes.ADVANCE_TO_TILE_TYPE:
        this.rooms[roomId].players[playerId] = advanceToTileTypeGameCard(
          player.id,
          drawnGameCard,
          room
        );

        return this.onPlayerLanding(socket);
      case GameCardTypes.WALK:
        return this.walkPlayer(socket, drawnGameCard.event.steps);
      case GameCardTypes.GO_TO_JAIL:
        return this.sendPlayerToJail(roomId, playerId);
      default:
        return;
    }
  };

  public purchaseProperty(io: Server, socket: Socket, propertyIndex: number) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");
    console.log("Player attempting to purchase...");

    if (!roomId) return;

    const room = this.rooms[roomId];
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
    this.rooms[roomId].players[socket.id].properties.push(propertyIndex);
    this.rooms[roomId].players[socket.id].money -= tile.cost;

    // update board
    tile.owner = player.id;
    this.rooms[roomId].map.board[propertyIndex] = tile;

    // console.log(this.rooms[roomId].map.board[propertyIndex]);
    console.log(this.rooms[roomId].players[socket.id]);

    io.in(roomId).emit("purchased_property", {
      propertyIndex,
      message: purchaseMessage,
    });

    this.writeLogToRoom(roomId, purchaseMessage);
  }

  public sellProperty(io: Server, socket: Socket, propertyIndex: number) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");
    console.log("Player attempting to sell property...");

    if (!roomId) return;

    const room = this.rooms[roomId];
    const player = room.players[socket.id];
    const tile = room.map.board[propertyIndex];

    console.log("Attempted player:", player, "Attempted Tile:", tile);

    if (room.currentPlayerTurnId !== socket.id) return;

    if (!isPurchasable(tile)) return;

    if (tile.owner !== socket.id || room.suspendedPlayers[socket.id]) return;

    const purchaseMessage = `${player.name} מכר את ${tile.name}`;

    // update player
    this.rooms[roomId].players[socket.id].properties = player.properties.filter(
      (tileIndex) => tileIndex !== propertyIndex
    );
    this.rooms[roomId].players[socket.id].money += tile.cost / 2;

    // update board
    tile.owner = null;
    this.rooms[roomId].map.board[propertyIndex] = tile;

    // console.log(this.rooms[roomId].map.board[propertyIndex]);
    console.log(this.rooms[roomId].players[socket.id]);

    io.in(roomId).emit("sold_property", {
      propertyIndex,
      message: purchaseMessage,
    });

    this.writeLogToRoom(roomId, purchaseMessage);
  }

  public rollDice(io: Server, socket: Socket) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const currentPlayerTurnId = this.rooms[roomId].currentPlayerTurnId;

    if (currentPlayerTurnId !== socket.id) return;

    const suspendedPlayer =
      this.rooms[roomId].suspendedPlayers[currentPlayerTurnId];
    let randomizeDices = [
      DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
      DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
    ];
    // let randomizeDices = [2, 5];

    // const allPlayers = this.rooms[roomId].players;
    // const firstPlayerId = Object.keys(allPlayers)[0];

    // test dices for first player
    // if (firstPlayerId === currentPlayerTurnId) {
    //   randomizeDices = [1, 1];
    // }

    const isDouble = randomizeDices[0] === randomizeDices[1];
    const dicesSum = randomizeDices[0] + randomizeDices[1];

    // update dices
    this.rooms[roomId].dices = randomizeDices;
    if (isDouble) this.rooms[roomId].doublesInARow++;

    io.in(roomId).emit("dice_rolled", {
      dices: randomizeDices,
    });

    if (suspendedPlayer && suspendedPlayer.reason === TileTypes.JAIL) {
      if (suspendedPlayer.left <= 0) {
        delete this.rooms[roomId].suspendedPlayers[currentPlayerTurnId];
      } else {
        if (!isDouble) {
          this.rooms[roomId].suspendedPlayers[currentPlayerTurnId].left--;
        } else {
          delete this.rooms[roomId].suspendedPlayers[currentPlayerTurnId];
        }
      }

      return this.switchTurn(io, socket);
    }

    // send player to jail
    if (this.rooms[roomId].doublesInARow === 3) {
      this.sendPlayerToJail(roomId, currentPlayerTurnId);

      return this.switchTurn(io, socket);
    }

    this.walkPlayer(socket, dicesSum);
  }

  public walkPlayer(socket: Socket, steps: number) {
    const roomId = this.getSocketRoomId(socket);
    const playerId = socket.id;

    console.log("--------------------------------------");

    if (!roomId) return;

    const room = this.rooms[roomId];
    const player = room.players[playerId];
    const { board, goRewards } = room?.map;
    const tileToWalk = player.tilePos + steps;
    const newPlayerPosition = cyclicRangeNumber(tileToWalk, board.length);
    const passedGo = tileToWalk > board.length && newPlayerPosition !== 0;

    this.rooms[roomId].players[playerId].tilePos = newPlayerPosition;
    this.rooms[roomId].players[playerId].money = passedGo
      ? player.money + goRewards.pass
      : player.money;

    return this.onPlayerLanding(socket);
  }

  public switchTurn(io: Server, socket: Socket): void {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const { currentPlayerTurnId, suspendedPlayers } = this.rooms[roomId];

    if (!currentPlayerTurnId) return;

    const playerIds = Object.keys(this.rooms[roomId].players);

    const nextPlayerTurnId = cycleNextItem({
      currentValue: currentPlayerTurnId,
      array: playerIds,
    });

    console.log(`Current player`, currentPlayerTurnId);
    console.log(`Maybe next player id`, nextPlayerTurnId);

    // update current player turn
    this.rooms[roomId].currentPlayerTurnId = nextPlayerTurnId;

    const nextSuspendedPlayer = suspendedPlayers[nextPlayerTurnId];

    console.log(`next suspended player`, nextSuspendedPlayer);

    // check if next player is suspended
    if (nextSuspendedPlayer) {
      if (nextSuspendedPlayer.reason === TileTypes.VACATION) {
        if (nextSuspendedPlayer.left === 0) {
          // can safely remove the player from suspension
          delete this.rooms[roomId].suspendedPlayers[nextPlayerTurnId];
        } else {
          this.rooms[roomId].suspendedPlayers[nextPlayerTurnId].left--;

          console.log(
            `Switching turns because ${nextPlayerTurnId} is on vacation`
          );

          console.log(
            "updated suspended state",
            this.rooms[roomId].suspendedPlayers
          );

          return this.switchTurn(io, socket);
        }
      }
    }

    // update room
    this.rooms[roomId].doublesInARow = 0;

    io.in(roomId).emit("switched_turn", {
      nextPlayerId: nextPlayerTurnId,
    });
  }

  public payOutOfJail(io: Server, socket: Socket) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const { currentPlayerTurnId, suspendedPlayers } = this.rooms[roomId];

    if (currentPlayerTurnId !== socket.id || !suspendedPlayers[socket.id])
      return;

    const player = this.rooms[roomId].players[socket.id];

    if (player.money >= PAY_OUT_FROM_JAIL_AMOUNT) {
      const message = `${player.name} שילם $${PAY_OUT_FROM_JAIL_AMOUNT} בשביל להשתחרר מהכלא`;

      this.rooms[roomId].players[socket.id].money -= PAY_OUT_FROM_JAIL_AMOUNT;

      // Remove player from suspension state
      delete this.rooms[roomId].suspendedPlayers[currentPlayerTurnId];

      io.in(roomId).emit("paid_out_of_jail", { message });

      this.writeLogToRoom(roomId, message);

      return this.switchTurn(io, socket);
    }
  }

  public upgradeCity(io: Server, socket: Socket, tileIndex: number) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const {
      currentPlayerTurnId,
      suspendedPlayers,
      map: { board },
    } = this.rooms[roomId];
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
    const player = this.rooms[roomId].players[socket.id];
    const message = `${player.name} שדרג ל${cityLevelText} ב${tile.name}`;

    tile.rentIndex += 1;
    this.rooms[roomId].map.board[tileIndex] = tile;
    this.rooms[roomId].players[socket.id].money -=
      tile.rentIndex === RentIndexes.FOUR_HOUSES
        ? tile.hotelCost
        : tile.houseCost;

    io.in(roomId).emit("city_level_change", {
      propertyIndex: tileIndex,
      changeType: "upgrade",
      message,
    });

    this.writeLogToRoom(roomId, message);
  }

  public downgradeCity(io: Server, socket: Socket, tileIndex: number) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const {
      currentPlayerTurnId,
      suspendedPlayers,
      map: { board },
    } = this.rooms[roomId];
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
    const player = this.rooms[roomId].players[socket.id];
    const message = `${player.name} שנמך ל${cityLevelText} ב${tile.name}`;
    const transactionAmount =
      tile.rentIndex === RentIndexes.HOTEL ? tile.hotelCost : tile.houseCost;

    tile.rentIndex -= 1;
    this.rooms[roomId].map.board[tileIndex] = tile;
    this.rooms[roomId].players[socket.id].money += transactionAmount / 2;

    io.in(roomId).emit("city_level_change", {
      propertyIndex: tileIndex,
      changeType: "downgrade",
      message,
    });

    this.writeLogToRoom(roomId, message);
  }

  public createTrade(io: Server, socket: Socket, trade: TradeType) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId || !isValidTrade(this.rooms[roomId], trade)) return;

    // check if offeror is the socket
    if (trade.offeror.id !== socket.id) return;

    trade.turn = trade.offeree.id;

    this.rooms[roomId].trades.push(trade);

    io.in(roomId).emit("trade_created", trade);
  }

  public acceptTrade(io: Server, socket: Socket, tradeId: string) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    console.log("sent tradeId", tradeId);

    if (!roomId) return;

    const room = this.rooms[roomId];
    const trade = room.trades.find((trade) => trade.id === tradeId);

    if (!trade) return null;

    const message = `${room.players[trade.offeror.id].name} ביצע עסקה עם ${
      room.players[trade.offeree.id].name
    }`;
    const fromPlayerProfit = -trade.offeror.money + trade.offeree.money;

    // update trade creator player
    this.rooms[roomId].players[trade.offeror.id].money += fromPlayerProfit;

    const toPlayerProfit = -trade.offeree.money + trade.offeror.money;

    // update trade recieved player
    this.rooms[roomId].players[trade.offeree.id].money += toPlayerProfit;

    this.rooms[roomId].map.board.map((tile, tileIndex) => {
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

    // console.log(this.rooms[roomId].map.board);
    console.log(this.rooms[roomId].players[trade.offeror.id].money);
    console.log(this.rooms[roomId].players[trade.offeree.id].money);

    io.in(roomId).emit("trade_accepted", {
      tradeId,
      message,
    });

    this.writeLogToRoom(roomId, message);
  }

  public declineTrade(io: Server, socket: Socket, tradeId: string) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    this.rooms[roomId].trades = this.rooms[roomId].trades.filter(
      (trade) => trade.id !== tradeId
    );

    io.in(roomId).emit("trade_declined", {
      tradeId,
    });
  }

  public updateTrade(io: Server, socket: Socket, trade: TradeType) {
    const roomId = this.getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const room = this.rooms[roomId];
    const tradeIndex = room.trades.findIndex(
      (_trade) => _trade.id === trade.id
    );
    const playerTurnInTrade = room.trades[tradeIndex].turn;
    const foundTrade = room.trades[tradeIndex];
    const playerIds = [foundTrade.offeror.id, foundTrade.offeree.id];

    if (playerTurnInTrade !== socket.id) return;

    if (tradeIndex === -1 || !isValidTrade(this.rooms[roomId], trade)) return;

    trade.turn = cycleNextItem({
      currentValue: foundTrade.turn,
      array: playerIds,
    });

    this.rooms[roomId].trades[tradeIndex] = trade;

    io.in(roomId).emit("trade_updated", trade);
  }
}

export default new GameController();
