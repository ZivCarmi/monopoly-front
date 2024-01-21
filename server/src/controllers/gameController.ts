import { Socket } from "socket.io";
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
import { GameCardTypes } from "../api/types/Cards";
import { RoomGameCards } from "../api/types/Game";
import io from "../services/socketService";
import {
  getPlayerIds,
  getSocketRoomId,
  writeLogToRoom,
} from "../utils/game-utils";

export const rooms: { [roomId: string]: Room } = {};

export function startGame(socket: Socket) {
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

  writeLogToRoom(roomId, gameStartMessage);
}

export function payRent(
  roomId: string,
  payerId: string,
  tile: PurchasableTile
) {
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

  writeLogToRoom(
    roomId,
    `${payingPlayer.name} שילם שכירות בסך $${rentAmount} לידי ${owner.name}`
  );
}

export function payTax(roomId: string, payerId: string, tile: ITax) {
  const payingPlayer = rooms[roomId].players[payerId];
  const taxAmount = Math.ceil((payingPlayer.money * tile.taxRate) / 100);

  rooms[roomId].players[payerId].money -= taxAmount;
}

export function onPlayerLanding(socket: Socket) {
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

    writeLogToRoom(
      roomId,
      `${playerName} נחת על ${landedTile.name} והרוויח $${goRewardOnLand}`
    );
  } else if (isPurchasable(landedTile)) {
    if (landedTile.owner && landedTile.owner !== playerId) {
      payRent(roomId, playerId, landedTile);
    }
  } else if (landedTile.type === TileTypes.CHANCE) {
    handleGameCard(socket, room.map.chances);
    rooms[roomId].map.chances.currentIndex += 1;
  } else if (isTax(landedTile)) {
    payTax(roomId, playerId, landedTile);
  } else if (landedTile.type === TileTypes.SURPRISE) {
    console.log("Drawing surprise.........");

    handleGameCard(socket, room.map.surprises);
    rooms[roomId].map.surprises.currentIndex += 1;
  } else if (isJail(landedTile)) {
    // Maybe do here something? not sure
  } else if (isVacation(landedTile)) {
    rooms[roomId].suspendedPlayers[playerId] = {
      reason: TileTypes.VACATION,
      left: landedTile.suspensionAmount,
    };

    writeLogToRoom(roomId, `${playerName} יצא לחופשה`);
  } else if (isGoToJail(landedTile)) {
    sendPlayerToJail(roomId, playerId);
  }

  console.log("Player state after landing", rooms[roomId].players[playerId]);
}

export function sendPlayerToJail(roomId: string, playerId: string) {
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

export function handleGameCard(socket: Socket, roomGameCards: RoomGameCards) {
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
      rooms[roomId].players[playerId] = advanceToTileGameCard(
        player.id,
        drawnGameCard,
        room
      );

      return onPlayerLanding(socket);
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

      return onPlayerLanding(socket);
    case GameCardTypes.WALK:
      return walkPlayer(socket, drawnGameCard.event.steps);
    case GameCardTypes.GO_TO_JAIL:
      return sendPlayerToJail(roomId, playerId);
    default:
      return;
  }
}

export function purchaseProperty(socket: Socket, propertyIndex: number) {
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

  writeLogToRoom(roomId, purchaseMessage);
}

export function sellProperty(socket: Socket, propertyIndex: number) {
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

  writeLogToRoom(roomId, purchaseMessage);
}

export function rollDice(socket: Socket) {
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

  const firstPlayerId = getPlayerIds(roomId)[0];

  // test dices for first player
  if (firstPlayerId === currentPlayerTurnId) {
    randomizeDices = [4, 3];
  } else {
    randomizeDices = [2, 1];
  }

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

    return switchTurn(socket);
  }

  // send player to jail
  if (rooms[roomId].doublesInARow === 3) {
    sendPlayerToJail(roomId, currentPlayerTurnId);

    return switchTurn(socket);
  }

  walkPlayer(socket, dicesSum);
}

export function walkPlayer(socket: Socket, steps: number) {
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

  return onPlayerLanding(socket);
}

export function switchTurn(socket: Socket): void {
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

        console.log("updated suspended state", rooms[roomId].suspendedPlayers);

        return switchTurn(socket);
      }
    }
  }

  // update room
  rooms[roomId].doublesInARow = 0;

  io.in(roomId).emit("switched_turn", {
    nextPlayerId: nextPlayerTurnId,
  });
}

export function payOutOfJail(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");

  if (!roomId) return;

  const { currentPlayerTurnId, suspendedPlayers } = rooms[roomId];

  if (currentPlayerTurnId !== socket.id || !suspendedPlayers[socket.id]) return;

  const player = rooms[roomId].players[socket.id];

  if (player.money >= PAY_OUT_FROM_JAIL_AMOUNT) {
    const message = `${player.name} שילם $${PAY_OUT_FROM_JAIL_AMOUNT} בשביל להשתחרר מהכלא`;

    rooms[roomId].players[socket.id].money -= PAY_OUT_FROM_JAIL_AMOUNT;

    // Remove player from suspension state
    delete rooms[roomId].suspendedPlayers[currentPlayerTurnId];

    io.in(roomId).emit("paid_out_of_jail", { message });

    writeLogToRoom(roomId, message);

    return switchTurn(socket);
  }
}

export function upgradeCity(socket: Socket, tileIndex: number) {
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

  writeLogToRoom(roomId, message);
}

export function downgradeCity(socket: Socket, tileIndex: number) {
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

  writeLogToRoom(roomId, message);
}

export function endGame(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  const winnerId = getPlayerIds(roomId)[0];

  io.in(roomId).emit("game_ended", {
    winnerId,
  });
}
