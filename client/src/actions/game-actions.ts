import { AppThunk } from "@/app/store";
import { AIRPORT_RENTS, COMPANY_RENTS } from "@backend/constants";
import { setLobbyRooms } from "@/slices/lobby-slice";
import {
  setPlayers,
  resetRoom,
  transferMoney,
  setRoom,
  suspendPlayer,
  drawGameCard,
  movePlayer,
  staySuspendedTurn,
  freePlayer,
  setDices,
  incrementPlayerPosition,
  allowTurnActions,
  endPlayerTurn,
  setSelfPlayerReady,
  setLandedTileIndex,
} from "@/slices/game-slice";
import { resetUi, setRoomUi, showToast, writeLog } from "@/slices/ui-slice";
import Player, { NewPlayer } from "@backend/types/Player";
import Room from "@backend/classes/Room";
import {
  getGoTile,
  getJailTileIndex,
  hasBuildings,
  hasMonopoly,
} from "@backend/helpers";
import { Socket } from "socket.io-client";
import {
  IJail,
  ITax,
  PurchasableTile,
  TileTypes,
  isAirport,
  isCard,
  isCompany,
  isGo,
  isGoToJail,
  isProperty,
  isPurchasable,
  isTax,
  isVacation,
} from "@backend/types/Board";
import { MS_TO_MOVE_ON_TILES } from "@/utils/constants";
import { GameCardTypes } from "@backend/types/Cards";
import {
  advanceToTileGameCard,
  advanceToTileTypeGameCard,
  paymentGameCard,
} from "./card-actions";
import { isPlayerInJail } from "../utils";

export const getRoomsHandler = (socket: Socket): AppThunk => {
  socket.emit("get_rooms");

  return (dispatch) => {
    socket.on("rooms_list", ({ rooms }) => {
      dispatch(setLobbyRooms(rooms));
    });
  };
};

export const handleRoomJoin = (socket: Socket, roomId: string): AppThunk => {
  socket.emit("join_game", { roomId });

  return (dispatch) => {
    socket.on("room_joined", ({ room }: { room: Room }) => {
      dispatch(setRoom(room));
      dispatch(setRoomUi(room.logs));
    });

    socket.on("room_join_error", ({ error }) => {
      dispatch(
        showToast({
          variant: "destructive",
          title: error,
        })
      );
    });
  };
};

export const handleCreatedPlayer = (
  socket: Socket,
  player: NewPlayer
): AppThunk => {
  socket.emit("create_player", { player });

  return (dispatch, getState) => {
    socket.on(
      "player_created",
      ({ player, message }: { player: Player; message: string }) => {
        dispatch(setPlayers([...getState().game.players, player]));
        dispatch(setSelfPlayerReady());
        dispatch(writeLog(message));
      }
    );

    socket.on("player_create_error", ({ error }) => {
      dispatch(
        showToast({
          variant: "destructive",
          title: error,
        })
      );
    });
  };
};

export const handlePlayerDisconnection = (socket: Socket): AppThunk => {
  socket.emit("back_to_lobby");

  return (dispatch, getState) => {
    socket.on("player_left", ({ playerId, message }) => {
      const players = getState().game.players;

      const remainingPlayers = players.filter(
        (player) => player.id !== playerId
      );

      dispatch(setPlayers(remainingPlayers));
      dispatch(writeLog(message));
    });

    ["left_room", "on_lobby"].forEach((event) => {
      socket.on(event, () => {
        dispatch(resetRoom());
        dispatch(resetUi());
      });
    });
  };
};

export const walkPlayer = (playerId: string, steps: number): AppThunk => {
  return (dispatch, getState) => {
    dispatch(allowTurnActions(false));

    // if steps is positive we move forward, otherwise backwards on the board
    const incrementor = steps > 0 ? 1 : -1;

    const interval = setInterval(() => {
      dispatch(incrementPlayerPosition({ playerId, incrementor }));

      const { players, map } = getState().game;
      const walkingPlayer = players.find((player) => playerId === player.id);

      // award player for passing GO tile
      if (walkingPlayer && walkingPlayer.tilePos === 0 && steps > 0) {
        const goTile = getGoTile(map.board);
        const goRewardOnPass = map.goRewards.pass;

        dispatch(
          writeLog(
            `${walkingPlayer.name} עבר ב${goTile.name} והרוויח $${goRewardOnPass}`
          )
        );

        dispatch(
          transferMoney({
            recieverId: playerId,
            amount: goRewardOnPass,
          })
        );
      }

      steps += incrementor === 1 ? -1 : 1;

      // when finished walking
      if (steps === 0) {
        clearInterval(interval);

        setTimeout(() => {
          dispatch(allowTurnActions(true));
          dispatch(handlePlayerLanding(playerId));
        }, MS_TO_MOVE_ON_TILES);
      }
    }, MS_TO_MOVE_ON_TILES);
  };
};

export const handleDices = (dices: number[], socket: Socket): AppThunk => {
  return (dispatch, getState) => {
    dispatch(setDices({ dices }));

    const { players, currentPlayerTurnId, doublesInARow } = getState().game;
    const player = players.find((player) => player.id === currentPlayerTurnId);
    const isDouble = dices[0] === dices[1];
    const dicesSum = dices.reduce((acc, dice) => acc + dice, 0);

    if (!player) throw new Error(`Player was not found`);

    if (!currentPlayerTurnId)
      throw new Error(`Current turn is not belong to ${currentPlayerTurnId}`);

    dispatch(
      setLandedTileIndex({
        currentPlayerPosition: player.tilePos,
        dicesSum: dicesSum,
      })
    );

    // update suspended player
    if (isPlayerInJail(currentPlayerTurnId)) {
      return !isDouble
        ? dispatch(handleStaySuspendedPlayer(currentPlayerTurnId))
        : dispatch(freePlayer({ playerId: currentPlayerTurnId }));
    }

    if (doublesInARow === 3) {
      dispatch(
        sendPlayerToJail(
          player,
          `${player.name} נשלח לכלא לאחר 3 דאבלים רצופים`
        )
      );

      return socket.emit("switch_turn");
    }

    dispatch(walkPlayer(currentPlayerTurnId, dicesSum));
  };
};

export const handleStaySuspendedPlayer = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { suspendedPlayers } = getState().game;

    if (suspendedPlayers[playerId] === undefined) {
      throw new Error(`Player ID: ${playerId} is not suspended.`);
    }

    const decreasedSuspensionLeft = suspendedPlayers[playerId].left - 1;

    decreasedSuspensionLeft > 0
      ? dispatch(staySuspendedTurn({ playerId }))
      : dispatch(freePlayer({ playerId }));
  };
};

export const handlePlayerLanding = (playerId: string): AppThunk => {
  return (dispatch, getState) => {
    const { players, map } = getState().game;
    const player = players.find((player) => player.id === playerId);

    if (!player)
      throw new Error(
        `Could not finish player landing, player with ID of ${playerId} was not found.`
      );

    const landedTile = map.board[player.tilePos];
    const goRewardOnLand = map.goRewards.land;

    if (isGo(landedTile)) {
      const goTile = getGoTile(map.board);

      dispatch(
        writeLog(
          `${player.name} נחת על ${goTile.name} והרוויח $${goRewardOnLand}`
        )
      );

      dispatch(
        transferMoney({
          recieverId: playerId,
          amount: goRewardOnLand,
        })
      );
    } else if (isPurchasable(landedTile)) {
      if (!landedTile.owner || landedTile.owner === playerId) return;

      dispatch(handleRentPayment(player, landedTile));
    } else if (isCard(landedTile)) {
      dispatch(drawGameCard({ type: landedTile.type }));

      dispatch(handleGameCard(player));
    } else if (isTax(landedTile)) {
      dispatch(handleTaxPayment(player, landedTile));
    } else if (isVacation(landedTile)) {
      dispatch(endPlayerTurn());

      dispatch(writeLog(`${player.name} יצא לחופשה`));

      return dispatch(
        suspendPlayer({
          playerId,
          suspensionReason: TileTypes.VACATION,
          suspensionLeft: landedTile.suspensionAmount,
        })
      );
    } else if (isGoToJail(landedTile)) {
      dispatch(sendPlayerToJail(player));
    }
  };
};

export const sendPlayerToJail = (player: Player, log?: string): AppThunk => {
  return (dispatch, getState) => {
    const { map } = getState().game;

    const jailTileIndex = getJailTileIndex(map.board);
    const jailTile = map.board[jailTileIndex] as IJail;

    if (!jailTile) {
      throw new Error("Jail tile not found on the board");
    }

    dispatch(movePlayer({ playerId: player.id, tilePosition: jailTileIndex }));

    dispatch(endPlayerTurn());

    dispatch(writeLog(log ?? `${player.name} נשלח לכלא`));

    return dispatch(
      suspendPlayer({
        playerId: player.id,
        suspensionReason: TileTypes.JAIL,
        suspensionLeft: jailTile.suspensionAmount,
      })
    );
  };
};

export const handleGameCard = (player: Player): AppThunk => {
  return (dispatch, getState) => {
    const { drawnGameCard } = getState().game;

    if (!drawnGameCard) throw new Error("No chance card was found.");

    switch (drawnGameCard.type) {
      case GameCardTypes.PAYMENT:
      case GameCardTypes.GROUP_PAYMENT:
        return dispatch(paymentGameCard(player.id, drawnGameCard));
      case GameCardTypes.ADVANCE_TO_TILE:
        dispatch(advanceToTileGameCard(player.id, drawnGameCard));
        return dispatch(handlePlayerLanding(player.id));
      case GameCardTypes.ADVANCE_TO_TILE_TYPE:
        dispatch(advanceToTileTypeGameCard(player.id, drawnGameCard));
        return dispatch(handlePlayerLanding(player.id));
      case GameCardTypes.WALK:
        return dispatch(walkPlayer(player.id, drawnGameCard.event.steps));
      case GameCardTypes.GO_TO_JAIL:
        return dispatch(sendPlayerToJail(player));
    }
  };
};

export const handleTaxPayment = (player: Player, tile: ITax): AppThunk => {
  return (dispatch) => {
    if (!tile.taxRate) return;

    const rentAmount = Math.ceil((player.money * tile.taxRate) / 100);

    dispatch(
      transferMoney({
        payerId: player.id,
        amount: rentAmount,
      })
    );
  };
};

export const handleRentPayment = (
  payer: Player,
  tile: PurchasableTile
): AppThunk => {
  return (dispatch, getState) => {
    const {
      players,
      map: { board },
    } = getState().game;
    const owner = players.find((player) => player.id === tile.owner);
    let rentAmount: number = 0;

    if (!owner) {
      throw new Error("Owner was not found in handleRentPayment");
    }

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

      rentAmount = Math.ceil((payer.money * rentIndexAmount) / 100);
    }

    dispatch(
      writeLog(
        `${payer.name} שילם שכירות בסך $${rentAmount} לידי ${owner.name}`
      )
    );

    dispatch(
      transferMoney({
        payerId: payer.id,
        recieverId: owner.id,
        amount: rentAmount,
      })
    );
  };
};
