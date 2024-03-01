import { Socket } from "socket.io";
import Room from "../api/classes/Room";
import {
  AIRPORT_RENTS,
  COMPANY_RENTS,
  MS_TO_MOVE_ON_TILES,
  PAY_OUT_FROM_JAIL_AMOUNT,
} from "../api/constants";
import {
  advanceToTileGameCard,
  advanceToTileTypeGameCard,
  getCityLevelText,
  getJailTileIndex,
  getVacationTileIndex,
  hasBuildings,
  hasMonopoly,
  paymentGameCard,
} from "../api/helpers";
import {
  IJail,
  ITax,
  IVacation,
  PurchasableTile,
  RentIndexes,
  TileTypes,
  isAirport,
  isChanceCard,
  isCompany,
  isGo,
  isGoToJail,
  isJail,
  isProperty,
  isPurchasable,
  isSurpriseCard,
  isTax,
  isVacation,
} from "../api/types/Board";
import { GameCardTypes } from "../api/types/Cards";
import { RoomGameCards } from "../api/types/Game";
import { cycleNextItem, cyclicRangeNumber, shuffleArray } from "../api/utils";
import io from "../services/socketService";
import {
  checkForWinner,
  getPlayerIds,
  getSocketRoomId,
  isOwner,
  isPlayerHasTurn,
  isPlayerInDebt,
  isPlayerInJail,
  randomizeDices,
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

  const startingPlayer = players[0].id;
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

    console.log("paying rent, amount:", rentAmount);
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

  rooms[roomId].players[payerId].money -= rentAmount;
  rooms[roomId].players[owner.id].money += rentAmount;

  writeLogToRoom(
    roomId,
    `${payingPlayer.name} שילם שכירות בסך $${rentAmount} לידי ${owner.name}`
  );

  if (rooms[roomId].players[payerId].money < 0) {
    rooms[roomId].players[payerId].debtTo = owner.id;
  }
}

export function payTax(roomId: string, payerId: string, tile: ITax) {
  const payingPlayer = rooms[roomId].players[payerId];
  const taxAmount = Math.ceil((payingPlayer.money * tile.taxRate) / 100);

  rooms[roomId].players[payerId].money -= taxAmount;

  writeLogToRoom(roomId, `${payingPlayer.name} שילם מס בסך $${taxAmount}`);
}

export function sendPlayerToVacation(playerId: string) {
  const roomId = getSocketRoomId(playerId);

  if (!rooms[roomId]) return;

  const vacationTileIndex = getVacationTileIndex(rooms[roomId].map.board);
  const vacationTile = rooms[roomId].map.board[vacationTileIndex] as IVacation;

  if (!vacationTile) return;

  rooms[roomId].players[playerId].tilePos = vacationTileIndex;
  rooms[roomId].suspendedPlayers[playerId] = {
    reason: TileTypes.VACATION,
    left: vacationTile.suspensionAmount,
  };
}

export function sendPlayerToJail(playerId: string) {
  const roomId = getSocketRoomId(playerId);

  if (!rooms[roomId]) return;

  const jailTileIndex = getJailTileIndex(rooms[roomId].map.board);
  const jailTile = rooms[roomId].map.board[jailTileIndex] as IJail;

  if (!jailTile) return;

  rooms[roomId].players[playerId].tilePos = jailTileIndex;
  rooms[roomId].suspendedPlayers[playerId] = {
    reason: TileTypes.JAIL,
    left: jailTile.suspensionAmount,
  };

  console.log("Player sent to jail", rooms[roomId].suspendedPlayers[playerId]);
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
      return sendPlayerToJail(playerId);
    default:
      return;
  }
}

export function purchaseProperty(socket: Socket, propertyIndex: number) {
  const roomId = getSocketRoomId(socket);

  console.log("Player attempting to purchase...");

  if (!roomId) return;

  const room = rooms[roomId];
  const player = room.players[socket.id];
  const tile = room.map.board[propertyIndex];

  console.log("Attempted player:", player);
  console.log("Attempted Tile:", tile);

  if (propertyIndex !== player.tilePos) {
    return console.log(
      "propertyIndex from client is not in sync with player position on server."
    );
  }

  if (
    !isPlayerHasTurn(socket.id) ||
    !isPurchasable(tile) ||
    tile.owner ||
    player.money < tile.cost
  )
    return;

  const purchaseMessage = `${player.name} רכש את ${tile.name}`;

  // update player
  rooms[roomId].players[socket.id].money -= tile.cost;

  // update board
  tile.owner = player.id;
  rooms[roomId].map.board[propertyIndex] = tile;

  console.log(rooms[roomId].players[socket.id]);

  io.in(roomId).emit("purchased_property", {
    propertyIndex,
    message: purchaseMessage,
  });

  writeLogToRoom(roomId, purchaseMessage);
}

export function sellProperty(socket: Socket, propertyIndex: number) {
  const roomId = getSocketRoomId(socket);

  console.log("Player attempting to sell property...");

  if (!roomId) return;

  const room = rooms[roomId];
  const player = room.players[socket.id];
  const tile = room.map.board[propertyIndex];

  console.log("Attempted player:", player, "Attempted Tile:", tile);

  if (
    !isPlayerHasTurn(socket.id) ||
    !isPurchasable(tile) ||
    !isOwner(socket.id, propertyIndex) ||
    isPlayerInJail(socket.id)
  )
    return;

  const purchaseMessage = `${player.name} מכר את ${tile.name}`;

  // update player
  rooms[roomId].players[socket.id].money += tile.cost / 2;
  rooms[roomId].players[socket.id].debtTo =
    rooms[roomId].players[socket.id].money >= 0 ? null : player.debtTo;

  // update board
  tile.owner = null;
  rooms[roomId].map.board[propertyIndex] = tile;

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
  console.log(
    `${rooms[roomId].players[socket.id].character} is Rolling dices.....`
  );

  if (!roomId || !isPlayerHasTurn(socket.id) || isPlayerInDebt(socket.id))
    return;

  rooms[roomId].dices = randomizeDices();

  // // FOR TESTING
  // const currentPlayerTurnId = rooms[roomId].currentPlayerTurnId;
  // const firstPlayerId = getPlayerIds(roomId)[0];
  // if (firstPlayerId === currentPlayerTurnId) {
  //   rooms[roomId].dices = [4, 3];
  // } else {
  //   rooms[roomId].dices = [2, 1];
  // }

  const isDouble = rooms[roomId].dices[0] === rooms[roomId].dices[1];
  const dicesSum = rooms[roomId].dices[0] + rooms[roomId].dices[1];

  if (isDouble) {
    rooms[roomId].doublesInARow++;
  }

  io.in(roomId).emit("dice_rolled", { dices: rooms[roomId].dices });

  console.log(rooms[roomId].suspendedPlayers);

  if (isPlayerInJail(socket.id)) {
    const suspensionTurnsLeft = --rooms[roomId].suspendedPlayers[socket.id]
      .left;

    console.log(
      "Player in jail switching turn, Suspended player:",
      rooms[roomId].suspendedPlayers[socket.id],
      "Turns left:",
      suspensionTurnsLeft
    );

    if (isDouble || suspensionTurnsLeft <= 0) {
      delete rooms[roomId].suspendedPlayers[socket.id];
    }

    return switchTurn(socket);
  }

  // send player to jail
  if (rooms[roomId].doublesInARow === 3) {
    sendPlayerToJail(socket.id);

    return switchTurn(socket);
  }

  console.log("before walking...");

  walkPlayer(socket, dicesSum);
}

export function walkPlayer(socket: Socket, steps: number) {
  const roomId = getSocketRoomId(socket);
  const playerId = socket.id;

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

export function onPlayerLanding(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  const room = rooms[roomId];
  const currentPlayerPosition = room.players[socket.id].tilePos;
  const landedTile = room.map.board[currentPlayerPosition];
  const goRewardOnLand = room.map.goRewards.land;

  if (isGo(landedTile)) {
    rooms[roomId].players[socket.id].money += goRewardOnLand;
  } else if (isPurchasable(landedTile)) {
    if (landedTile.owner && landedTile.owner !== socket.id) {
      payRent(roomId, socket.id, landedTile);
    }
  } else if (isChanceCard(landedTile)) {
    handleGameCard(socket, room.map.chances);
    rooms[roomId].map.chances.currentIndex += 1;
  } else if (isTax(landedTile)) {
    payTax(roomId, socket.id, landedTile);
  } else if (isSurpriseCard(landedTile)) {
    handleGameCard(socket, room.map.surprises);
    rooms[roomId].map.surprises.currentIndex += 1;
  } else if (isJail(landedTile)) {
    // Maybe do here something? not sure
  } else if (isVacation(landedTile)) {
    sendPlayerToVacation(socket.id);
    // can switch turn here.
  } else if (isGoToJail(landedTile)) {
    sendPlayerToJail(socket.id);
  }

  const timeToLand = (room.dices[0] + room.dices[1]) * MS_TO_MOVE_ON_TILES;

  setTimeout(() => {
    if (isPlayerInDebt(socket.id)) {
      const { debtTo } = rooms[roomId].players[socket.id];
      io.in(roomId).emit("player_in_debt", { playerId: socket.id, debtTo });
    }
  }, timeToLand);
}

export function switchTurn(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  console.log("--------------------------------------");
  console.log("Switching turn...");

  if (!roomId) return;

  if (!isPlayerHasTurn(socket.id) && isPlayerInDebt(socket.id)) return;

  const winnerId = checkForWinner(roomId);

  if (winnerId) {
    return io.in(roomId).emit("game_ended", { winnerId });
  }

  const nextPlayerTurnId = cycleNextItem({
    currentValue: socket.id,
    array: getPlayerIds(roomId),
  });

  console.log(
    "Turn before switch belongs to -",
    rooms[roomId]?.players[socket.id]?.character
  );
  console.log(
    "Turn after switch belongs to -",
    rooms[roomId]?.players[nextPlayerTurnId]?.character
  );

  // update current player turn
  rooms[roomId].currentPlayerTurnId = nextPlayerTurnId;

  const nextSuspendedPlayer = rooms[roomId].suspendedPlayers[nextPlayerTurnId];

  // switch turn if next player is on vacation or free him from vacation
  if (nextSuspendedPlayer?.reason === TileTypes.VACATION) {
    console.log(
      `Next suspended player is`,
      rooms[roomId].players[nextPlayerTurnId].character,
      "Suspension data:",
      nextSuspendedPlayer
    );

    if (nextSuspendedPlayer.left <= 0) {
      // can safely remove the player from suspension
      delete rooms[roomId].suspendedPlayers[nextPlayerTurnId];
    } else {
      const nextSocketPlayer = io.sockets.sockets.get(nextPlayerTurnId);

      rooms[roomId].suspendedPlayers[nextPlayerTurnId].left--;

      console.log(
        `Switching turns because ${rooms[roomId].players[nextPlayerTurnId].character} is on vacation`
      );

      console.log("Updated suspended state", rooms[roomId].suspendedPlayers);

      if (nextSocketPlayer) {
        return switchTurn(nextSocketPlayer);
      } else {
        return console.log("Next socket is not found!\nNeed to check why...");
      }
    }
  }

  // check if next player owes money from 3rd source (could be after surprise/chance cards)
  if (rooms[roomId].players[nextPlayerTurnId].money < 0) {
    let debtTo = isPlayerInDebt(nextPlayerTurnId);

    if (debtTo === null) {
      rooms[roomId].players[nextPlayerTurnId].debtTo = "bank";
    }

    io.in(roomId).emit("player_in_debt", {
      playerId: nextPlayerTurnId,
      debtTo: rooms[roomId].players[nextPlayerTurnId].debtTo,
    });
  }

  // update room
  rooms[roomId].doublesInARow = 0;

  io.in(roomId).emit("switched_turn", { nextPlayerId: nextPlayerTurnId });

  console.log("Turn switched");
}

export function payOutOfJail(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  if (!isPlayerHasTurn(socket.id) || !isPlayerInJail(socket.id)) return;

  const player = rooms[roomId].players[socket.id];

  if (player.money >= PAY_OUT_FROM_JAIL_AMOUNT) {
    const message = `${player.name} שילם $${PAY_OUT_FROM_JAIL_AMOUNT} בשביל להשתחרר מהכלא`;

    rooms[roomId].players[socket.id].money -= PAY_OUT_FROM_JAIL_AMOUNT;

    // Remove player from suspension state
    delete rooms[roomId].suspendedPlayers[socket.id];

    io.in(roomId).emit("paid_out_of_jail", { message });

    writeLogToRoom(roomId, message);

    return switchTurn(socket);
  }
}

export function upgradeCity(socket: Socket, propertyIndex: number) {
  const roomId = getSocketRoomId(socket);

  console.log("Attempting to Upgrade city....");

  if (!roomId) return;

  const {
    map: { board },
  } = rooms[roomId];
  const tile = board[propertyIndex];

  if (
    !isProperty(tile) ||
    !hasMonopoly(board, tile.country.id) ||
    !isPlayerHasTurn(socket.id) ||
    isPlayerInJail(socket.id) ||
    tile.rentIndex === RentIndexes.HOTEL
  )
    return;

  const player = rooms[roomId].players[socket.id];
  const upgradeCost =
    tile.rentIndex === RentIndexes.FOUR_HOUSES
      ? tile.hotelCost
      : tile.houseCost;

  if (player.money < upgradeCost) {
    console.log("Player doesn't have money in upgradeCity", player);
    return;
  }

  tile.rentIndex += 1;
  rooms[roomId].map.board[propertyIndex] = tile;
  rooms[roomId].players[socket.id].money -= upgradeCost;

  const cityLevelText = getCityLevelText(tile.rentIndex + 1);
  const message = `${player.name} שדרג ל${cityLevelText} ב${tile.name}`;

  io.in(roomId).emit("city_level_change", {
    propertyIndex,
    changeType: "upgrade",
    message,
  });

  writeLogToRoom(roomId, message);
}

export function downgradeCity(socket: Socket, propertyIndex: number) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  const {
    map: { board },
  } = rooms[roomId];
  const tile = board[propertyIndex];

  if (
    !isProperty(tile) ||
    !hasMonopoly(board, tile.country.id) ||
    !isPlayerHasTurn(socket.id) ||
    isPlayerInJail(socket.id) ||
    tile.rentIndex === RentIndexes.BLANK
  )
    return;

  const cityLevelText = getCityLevelText(tile.rentIndex - 1);
  const player = rooms[roomId].players[socket.id];
  const message = `${player.name} שנמך ל${cityLevelText} ב${tile.name}`;
  const transactionAmount =
    tile.rentIndex === RentIndexes.HOTEL ? tile.hotelCost : tile.houseCost;

  tile.rentIndex -= 1;
  rooms[roomId].map.board[propertyIndex] = tile;
  rooms[roomId].players[socket.id].money += transactionAmount / 2;
  rooms[roomId].players[socket.id].debtTo =
    rooms[roomId].players[socket.id].money >= 0 ? null : player.debtTo;

  io.in(roomId).emit("city_level_change", {
    propertyIndex: propertyIndex,
    changeType: "downgrade",
    message,
  });

  writeLogToRoom(roomId, message);
}

export function endGame(socket: Socket) {
  const roomId = getSocketRoomId(socket);

  if (!roomId) return;

  const winnerId = getPlayerIds(roomId)[0];

  io.in(roomId).emit("game_ended", { winnerId });
}
