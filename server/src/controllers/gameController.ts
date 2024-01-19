import { Server, Socket } from "socket.io";
import Player, { NewPlayer } from "../api/types/Player";
import Room, { LobbyRoom } from "../api/classes/Room";
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
import { GameCardTypes } from "../api/types/Cards";
import { RoomGameCards, TradeType } from "../api/types/Game";
import { PLAYER_MONEY } from "../config";

export const rooms: { [roomId: string]: Room } = {};

const getPlayerIds = (roomId: string) => {
  if (!rooms[roomId]) return [];

  return Object.keys(rooms[roomId].players);
};

const getPlayersCount = (roomId: string) => {
  return getPlayerIds(roomId).length;
};

const checkForWinner = (roomId: string): string => {
  if (!rooms[roomId]) return "";

  const playerIds = getPlayerIds(roomId);

  return playerIds.length === 1 ? playerIds[0] : "";
};

const deleteRoom = (io: Server, socket: Socket) => {
  const roomId = getSocketRoomId(socket);

  socket.broadcast.to(roomId).emit("room_deleted");

  io.in(roomId).socketsLeave(roomId);

  delete rooms[roomId];
};

export const getSocketRoomId = (socket: Socket): string => {
  const socketRooms = Array.from(socket.rooms.values()).filter(
    (r) => r !== socket.id
  );
  const roomId = socketRooms && socketRooms[0];

  return roomId;
};

class GameController {
  private writeLogToRoom(roomId: string, message: string | string[]) {
    const room = rooms[roomId];

    if (!room) return;

    if (Array.isArray(message)) {
      for (let i = 0; i < message.length; i++) {
        rooms[roomId].logs.unshift(message[i]);
      }
    } else {
      rooms[roomId].logs.unshift(message);
    }
  }

  public async backToLobby(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);

    if (!roomId) return;

    console.log("-----------------------------\nBacking up to lobby...");

    socket.emit("on_lobby");

    const roomPlayersCount = getPlayersCount(roomId);
    const connectedSockets = io.sockets.adapter.rooms.get(roomId);
    let messages: string[] = [];

    if (rooms[roomId].players[socket.id] !== undefined) {
      messages.push(`${rooms[roomId].players[socket.id].name} עזב את המשחק`);
    } else {
      messages.push("צופה עזב את המשחק");
    }

    if (connectedSockets?.size === 1) {
      // Delete room
      deleteRoom(io, socket);
    } else {
      let roomHostId = rooms[roomId].hostId;
      const isMoreThanOnePlayer = roomPlayersCount > 1;

      // Decrease room participants count by 1
      delete rooms[roomId].players[socket.id];

      // nominate new host id for the room
      if (rooms[roomId].hostId === socket.id && isMoreThanOnePlayer) {
        roomHostId = this.updateHostId(io, socket);
        const hostPlayer = rooms[roomId].players[roomHostId];

        console.log(hostPlayer);

        messages.push(`${hostPlayer.name} מונה למארח החדר`);
      }

      socket.to(roomId).emit("update_players", {
        players: rooms[roomId].players,
        message: messages,
        roomHostId,
      });

      socket.leave(roomId);
    }

    this.writeLogToRoom(roomId, messages);

    console.log(
      `Left room - ${roomId} and now on lobby\n-----------------------------`
    );
  }

  public updateHostId(io: Server, socket: Socket, newHostId?: string): string {
    newHostId = "";
    const roomId = getSocketRoomId(socket);

    if (!rooms[roomId]) return newHostId;

    if (!newHostId) {
      const availablePlayers = getPlayerIds(roomId).filter(
        (playerId) => playerId !== socket.id
      );

      if (availablePlayers.length > 0) {
        // assign the first player from the available players in the room
        newHostId = availablePlayers[0];
      }
    }

    console.log(newHostId);

    rooms[roomId].hostId = newHostId;

    return newHostId;
  }

  public async getRooms(io: Server, socket: Socket) {
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

  public async joinRoom(io: Server, socket: Socket, roomId: string) {
    const connectedSockets = io.sockets.adapter.rooms.get(roomId);
    const existRoomId = getSocketRoomId(socket);

    console.log("New User joining room:", roomId);

    if (existRoomId) {
      return socket.emit("room_join_error", {
        error: "Cannot join a room while on another room",
      });
    }

    // Maximum of 6 players + 4 spectators
    if (connectedSockets && connectedSockets.size === 10) {
      return socket.emit("room_join_error", {
        error: "Room is full, please choose another room.",
      });
    }

    let room = new Room(roomId, socket.id);

    if (rooms[roomId]) {
      // Update room
      room = rooms[roomId];

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

    await socket.join(roomId);

    socket.emit("room_joined", { room });
  }

  public addPlayer(io: Server, socket: Socket, player: NewPlayer) {
    const roomId = getSocketRoomId(socket);

    if (!roomId) {
      return socket.emit("player_create_error", {
        error: "Could not create player",
      });
    }

    const joinedMessage = `${player.name} נכנס למשחק`;
    const newPlayer: Player = {
      ...player,
      money: PLAYER_MONEY,
      tilePos: 0,
      properties: [],
      bankrupted: false,
    };

    // add the player
    rooms[roomId].players[newPlayer.id] = newPlayer;

    socket.emit("player_created");

    io.in(roomId).emit("update_players", {
      players: rooms[roomId].players,
      message: joinedMessage,
    });

    this.writeLogToRoom(roomId, joinedMessage);
  }

  public playerDisconnect(io: Server, socket: Socket) {
    // const roomId = getSocketRoomId(socket);
    // console.log(roomId);
    // if (!roomId) return;
    // console.log(rooms[roomId].players[socket.id]);
  }

  public playerDisconnecting(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);

    if (!roomId) return;

    const roomPlayersCount = getPlayersCount(roomId);
    const connectedSockets = io.sockets.adapter.rooms.get(roomId);
    const lastPlayerInRoom =
      roomPlayersCount === 1 && connectedSockets && connectedSockets.size === 1;
    let leaveMessage = "";

    if (rooms[roomId].players[socket.id] !== undefined) {
      leaveMessage = `${rooms[roomId].players[socket.id].name} עזב את המשחק`;
    } else {
      leaveMessage = "צופה עזב את המשחק";
    }

    this.writeLogToRoom(roomId, leaveMessage);

    if (
      (connectedSockets && connectedSockets.size === 1) ||
      (roomPlayersCount <= 1 && rooms[roomId]?.players[socket.id])
    ) {
      deleteRoom(io, socket);
    } else {
      console.log("in 2nd if");

      const roomHostId = this.updateHostId(io, socket);

      // Decrease room participants count by 1
      delete rooms[roomId].players[socket.id];

      socket.to(roomId).emit("update_players", {
        players: rooms[roomId].players,
        message: leaveMessage,
        roomHostId,
      });

      socket.leave(roomId);
    }
  }

  public startGame(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);

    if (!roomId) return;

    const players = Object.values(rooms[roomId].players);

    if (socket.id !== rooms[roomId].hostId || players.length < 2) return;

    // randomize the players array (IF COMMENTED IT'S FOR TESTING)
    shuffleArray(players);

    const startingPlayer = players[1].id;
    const gameStartMessage = "המשחק התחיל!";

    rooms[roomId].participants = { ...rooms[roomId].players };
    rooms[roomId].gameStarted = true;
    rooms[roomId].currentPlayerTurnId = startingPlayer;

    io.in(roomId).emit("game_started", {
      generatedPlayers: players,
      currentPlayerTurn: startingPlayer,
      message: gameStartMessage,
    });

    this.writeLogToRoom(roomId, gameStartMessage);
  }

  private payRent(roomId: string, payerId: string, tile: PurchasableTile) {
    const board = rooms[roomId].map.board;
    const payingPlayer = rooms[roomId].players[payerId];
    const owner = tile.owner && rooms[roomId].players[tile.owner];
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

    rooms[roomId].players[payerId].money = payingPlayer.money - rentAmount;
    rooms[roomId].players[owner.id].money += rentAmount;

    this.writeLogToRoom(
      roomId,
      `${payingPlayer.name} שילם שכירות בסך $${rentAmount} לידי ${owner.name}`
    );
  }

  private payTax(roomId: string, payerId: string, tile: ITax) {
    const payingPlayer = rooms[roomId].players[payerId];
    const taxAmount = Math.ceil((payingPlayer.money * tile.taxRate) / 100);

    rooms[roomId].players[payerId].money -= taxAmount;
  }

  private onPlayerLanding(socket: Socket) {
    const roomId = getSocketRoomId(socket);
    const playerId = socket.id;

    if (!roomId) return;

    const room = rooms[roomId];
    const currentPlayerPosition = room.players[playerId].tilePos;
    const landedTile = room.map.board[currentPlayerPosition];
    const playerName = room.players[playerId].name;
    const goRewardOnLand = room.map.goRewards.land;

    if (isGo(landedTile)) {
      rooms[roomId].players[playerId].money += goRewardOnLand;

      this.writeLogToRoom(
        roomId,
        `${playerName} נחת על ${landedTile.name} והרוויח $${goRewardOnLand}`
      );
    } else if (isPurchasable(landedTile)) {
      if (landedTile.owner && landedTile.owner !== playerId) {
        this.payRent(roomId, playerId, landedTile);
      }
    } else if (landedTile.type === TileTypes.CHANCE) {
      this.handleGameCard(socket, room.map.chances);
      rooms[roomId].map.chances.currentIndex += 1;
    } else if (isTax(landedTile)) {
      this.payTax(roomId, playerId, landedTile);
    } else if (landedTile.type === TileTypes.SURPRISE) {
      console.log("Drawing surprise.........");

      this.handleGameCard(socket, room.map.surprises);
      rooms[roomId].map.surprises.currentIndex += 1;
    } else if (isJail(landedTile)) {
      // Maybe do here something? not sure
    } else if (isVacation(landedTile)) {
      rooms[roomId].suspendedPlayers[playerId] = {
        reason: TileTypes.VACATION,
        left: landedTile.suspensionAmount,
      };

      this.writeLogToRoom(roomId, `${playerName} יצא לחופשה`);
    } else if (isGoToJail(landedTile)) {
      this.sendPlayerToJail(roomId, playerId);
    }

    console.log("Player state after landing", rooms[roomId].players[playerId]);
  }

  public sendPlayerToJail(roomId: string, playerId: string) {
    const room = rooms[roomId];

    if (!room) {
      console.log("Room not found in sendPlayerToJail");
      return;
    }

    const jailTileIndex = getJailTileIndex(room.map.board);
    const jailTile = room.map.board[jailTileIndex] as IJail;

    if (!jailTile) return;

    rooms[roomId].players[playerId].tilePos = jailTileIndex;
    rooms[roomId].suspendedPlayers[playerId] = {
      reason: TileTypes.JAIL,
      left: jailTile.suspensionAmount,
    };
  }

  private handleGameCard = (socket: Socket, roomGameCards: RoomGameCards) => {
    const roomId = getSocketRoomId(socket);
    const playerId = socket.id;

    if (!roomId) return;

    const room = rooms[roomId];
    const player = rooms[roomId].players[playerId];
    const drawnGameCard = cycleNextItem({
      currentIndex: roomGameCards.currentIndex,
      array: roomGameCards.cards,
    });

    switch (drawnGameCard.type) {
      case GameCardTypes.PAYMENT:
      case GameCardTypes.GROUP_PAYMENT:
        rooms[roomId].players = paymentGameCard(player.id, drawnGameCard, room);

        return;
      case GameCardTypes.ADVANCE_TO_TILE:
        advanceToTileGameCard(socket, drawnGameCard);

        // rooms[roomId].players[playerId] = advanceToTileGameCard(
        //   player.id,
        //   drawnGameCard,
        //   room
        // );

        return this.onPlayerLanding(socket);
      case GameCardTypes.ADVANCE_TO_TILE_TYPE:
        rooms[roomId].players[playerId] = advanceToTileTypeGameCard(
          player.id,
          drawnGameCard,
          room
        );

        console.log(
          "on advanceToTileTypeGameCard, player after update...",
          rooms[roomId].players[playerId]
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
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");
    console.log("Player attempting to purchase...");

    if (!roomId) return;

    const room = rooms[roomId];
    const player = room.players[socket.id];
    const tile = room.map.board[propertyIndex];

    console.log("Attempted player:", player);
    console.log("Attempted Tile:", tile);

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
    rooms[roomId].players[socket.id].properties.push(propertyIndex);
    rooms[roomId].players[socket.id].money -= tile.cost;

    // update board
    tile.owner = player.id;
    rooms[roomId].map.board[propertyIndex] = tile;

    // console.log(rooms[roomId].map.board[propertyIndex]);
    console.log(rooms[roomId].players[socket.id]);

    io.in(roomId).emit("purchased_property", {
      propertyIndex,
      message: purchaseMessage,
    });

    this.writeLogToRoom(roomId, purchaseMessage);
  }

  public sellProperty(io: Server, socket: Socket, propertyIndex: number) {
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");
    console.log("Player attempting to sell property...");

    if (!roomId) return;

    const room = rooms[roomId];
    const player = room.players[socket.id];
    const tile = room.map.board[propertyIndex];

    console.log("Attempted player:", player, "Attempted Tile:", tile);

    if (room.currentPlayerTurnId !== socket.id) return;

    if (!isPurchasable(tile)) return;

    if (tile.owner !== socket.id || room.suspendedPlayers[socket.id]) return;

    const purchaseMessage = `${player.name} מכר את ${tile.name}`;

    // update player
    rooms[roomId].players[socket.id].properties = player.properties.filter(
      (tileIndex) => tileIndex !== propertyIndex
    );
    rooms[roomId].players[socket.id].money += tile.cost / 2;

    // update board
    tile.owner = null;
    rooms[roomId].map.board[propertyIndex] = tile;

    // console.log(rooms[roomId].map.board[propertyIndex]);
    console.log(rooms[roomId].players[socket.id]);

    io.in(roomId).emit("sold_property", {
      propertyIndex,
      message: purchaseMessage,
    });

    this.writeLogToRoom(roomId, purchaseMessage);
  }

  public rollDice(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const currentPlayerTurnId = rooms[roomId].currentPlayerTurnId;

    if (currentPlayerTurnId !== socket.id) return;

    if (rooms[roomId].players[socket.id].money < 0) return;

    const suspendedPlayer = rooms[roomId].suspendedPlayers[currentPlayerTurnId];
    let randomizeDices = [
      DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
      DICE_OPTIONS[Math.floor(Math.random() * DICE_OPTIONS.length)],
    ];
    // let randomizeDices = [2, 5];

    // const firstPlayerId = getPlayerIds(roomId)[0];

    // // test dices for first player
    // if (firstPlayerId === currentPlayerTurnId) {
    //   randomizeDices = [4, 3];
    // } else {
    //   randomizeDices = [2, 1];
    // }

    const isDouble = randomizeDices[0] === randomizeDices[1];
    const dicesSum = randomizeDices[0] + randomizeDices[1];

    // update dices
    rooms[roomId].dices = randomizeDices;
    if (isDouble) {
      rooms[roomId].doublesInARow++;
    }

    io.in(roomId).emit("dice_rolled", {
      dices: randomizeDices,
    });

    // if player in jail
    if (suspendedPlayer && suspendedPlayer.reason === TileTypes.JAIL) {
      const suspensionTurnsLeft = --rooms[roomId].suspendedPlayers[
        currentPlayerTurnId
      ].left;

      if (isDouble || suspensionTurnsLeft === 0) {
        delete rooms[roomId].suspendedPlayers[currentPlayerTurnId];
      }

      console.log(
        "Switching turn after suspension action...",
        rooms[roomId].suspendedPlayers[currentPlayerTurnId]
      );

      return this.switchTurn(io, socket);
    }

    // send player to jail
    if (rooms[roomId].doublesInARow === 3) {
      this.sendPlayerToJail(roomId, currentPlayerTurnId);

      return this.switchTurn(io, socket);
    }

    this.walkPlayer(socket, dicesSum);
  }

  public walkPlayer(socket: Socket, steps: number) {
    const roomId = getSocketRoomId(socket);
    const playerId = socket.id;

    console.log("--------------------------------------");

    if (!roomId) return;

    const room = rooms[roomId];
    const player = room.players[playerId];
    const { board, goRewards } = room?.map;
    const tileToWalk = player.tilePos + steps;
    const newPlayerPosition = cyclicRangeNumber(tileToWalk, board.length);
    const passedGo = tileToWalk > board.length && newPlayerPosition !== 0;

    rooms[roomId].players[playerId].tilePos = newPlayerPosition;
    rooms[roomId].players[playerId].money = passedGo
      ? player.money + goRewards.pass
      : player.money;

    return this.onPlayerLanding(socket);
  }

  public switchTurn(io: Server, socket: Socket): void {
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const { currentPlayerTurnId, suspendedPlayers } = rooms[roomId];

    if (!currentPlayerTurnId) return;

    const nextPlayerTurnId = cycleNextItem({
      currentValue: currentPlayerTurnId,
      array: getPlayerIds(roomId),
    });

    console.log(
      `Turn before switch belongs to - `,
      rooms[roomId].players[currentPlayerTurnId].character
    );
    console.log(
      `Turn after switch belongs to - `,
      rooms[roomId].players[nextPlayerTurnId].character
    );

    // update current player turn
    rooms[roomId].currentPlayerTurnId = nextPlayerTurnId;

    const nextSuspendedPlayer = suspendedPlayers[nextPlayerTurnId];

    // check if next player is suspended
    if (nextSuspendedPlayer) {
      console.log(
        `Next suspended player is`,
        rooms[roomId].players[nextPlayerTurnId].character,
        "Suspension data:",
        nextSuspendedPlayer
      );
      if (nextSuspendedPlayer.reason === TileTypes.VACATION) {
        if (nextSuspendedPlayer.left === 0) {
          // can safely remove the player from suspension
          delete rooms[roomId].suspendedPlayers[nextPlayerTurnId];
        } else {
          rooms[roomId].suspendedPlayers[nextPlayerTurnId].left--;

          console.log(
            `Switching turns because ${rooms[roomId].players[nextPlayerTurnId].character} is on vacation`
          );

          console.log(
            "updated suspended state",
            rooms[roomId].suspendedPlayers
          );

          return this.switchTurn(io, socket);
        }
      }
    }

    // update room
    rooms[roomId].doublesInARow = 0;

    io.in(roomId).emit("switched_turn", {
      nextPlayerId: nextPlayerTurnId,
    });
  }

  public payOutOfJail(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const { currentPlayerTurnId, suspendedPlayers } = rooms[roomId];

    if (currentPlayerTurnId !== socket.id || !suspendedPlayers[socket.id])
      return;

    const player = rooms[roomId].players[socket.id];

    if (player.money >= PAY_OUT_FROM_JAIL_AMOUNT) {
      const message = `${player.name} שילם $${PAY_OUT_FROM_JAIL_AMOUNT} בשביל להשתחרר מהכלא`;

      rooms[roomId].players[socket.id].money -= PAY_OUT_FROM_JAIL_AMOUNT;

      // Remove player from suspension state
      delete rooms[roomId].suspendedPlayers[currentPlayerTurnId];

      io.in(roomId).emit("paid_out_of_jail", { message });

      this.writeLogToRoom(roomId, message);

      return this.switchTurn(io, socket);
    }
  }

  public upgradeCity(io: Server, socket: Socket, tileIndex: number) {
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const {
      currentPlayerTurnId,
      suspendedPlayers,
      map: { board },
    } = rooms[roomId];
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
    const player = rooms[roomId].players[socket.id];
    const message = `${player.name} שדרג ל${cityLevelText} ב${tile.name}`;

    tile.rentIndex += 1;
    rooms[roomId].map.board[tileIndex] = tile;
    rooms[roomId].players[socket.id].money -=
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
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const {
      currentPlayerTurnId,
      suspendedPlayers,
      map: { board },
    } = rooms[roomId];
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
    const player = rooms[roomId].players[socket.id];
    const message = `${player.name} שנמך ל${cityLevelText} ב${tile.name}`;
    const transactionAmount =
      tile.rentIndex === RentIndexes.HOTEL ? tile.hotelCost : tile.houseCost;

    tile.rentIndex -= 1;
    rooms[roomId].map.board[tileIndex] = tile;
    rooms[roomId].players[socket.id].money += transactionAmount / 2;

    io.in(roomId).emit("city_level_change", {
      propertyIndex: tileIndex,
      changeType: "downgrade",
      message,
    });

    this.writeLogToRoom(roomId, message);
  }

  public createTrade(io: Server, socket: Socket, trade: TradeType) {
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId || !isValidTrade(rooms[roomId], trade)) return;

    // check if offeror is the socket
    if (trade.offeror.id !== socket.id) return;

    trade.turn = trade.offeree.id;

    rooms[roomId].trades.push(trade);

    io.in(roomId).emit("trade_created", trade);
  }

  public acceptTrade(io: Server, socket: Socket, tradeId: string) {
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

    this.writeLogToRoom(roomId, message);
  }

  public declineTrade(io: Server, socket: Socket, tradeId: string) {
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

  public updateTrade(io: Server, socket: Socket, trade: TradeType) {
    const roomId = getSocketRoomId(socket);

    console.log("--------------------------------------");

    if (!roomId) return;

    const room = rooms[roomId];
    const tradeIndex = room.trades.findIndex(
      (_trade) => _trade.id === trade.id
    );
    const playerTurnInTrade = room.trades[tradeIndex].turn;
    const foundTrade = room.trades[tradeIndex];
    const playerIds = [foundTrade.offeror.id, foundTrade.offeree.id];

    if (playerTurnInTrade !== socket.id) return;

    if (tradeIndex === -1 || !isValidTrade(rooms[roomId], trade)) return;

    trade.turn = cycleNextItem({
      currentValue: foundTrade.turn,
      array: playerIds,
    });

    rooms[roomId].trades[tradeIndex] = trade;

    io.in(roomId).emit("trade_updated", trade);
  }

  public endGame(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);

    if (!roomId) return;

    const winnerId = getPlayerIds(roomId)[0];

    io.in(roomId).emit("game_ended", {
      winnerId,
    });
  }

  public bankruptPlayer(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);
    const player = rooms[roomId]?.players[socket.id];

    if (!roomId || !player) return;

    if (rooms[roomId].currentPlayerTurnId === socket.id) {
      this.switchTurn(io, socket);
    }

    delete rooms[roomId].players[socket.id];
    rooms[roomId].participants[socket.id].bankrupted = true;
    rooms[roomId].map.board = rooms[roomId].map.board.map((tile) => {
      if (isPurchasable(tile) && tile.owner === socket.id) {
        tile.owner = null;

        if (isProperty(tile)) {
          tile.rentIndex = RentIndexes.BLANK;
        }
      }

      return tile;
    });

    io.in(roomId).emit("player_bankrupted", {
      playerId: socket.id,
      message: `${player.name} פשט את הרגל`,
    });

    const winnerId = checkForWinner(roomId);

    if (winnerId) {
      io.in(roomId).emit("game_ended", {
        winnerId,
      });
    }
  }

  public setOvercharge(io: Server, socket: Socket) {
    const roomId = getSocketRoomId(socket);

    if (!roomId) return;

    if (rooms[roomId].currentPlayerTurnId !== socket.id) return;

    const player = rooms[roomId].players[socket.id];

    if (player.money >= 0) return;

    if (player.properties.length === 0) {
      return this.bankruptPlayer(io, socket);
    }

    socket.emit("on_overcharge");
  }
}

export default new GameController();
