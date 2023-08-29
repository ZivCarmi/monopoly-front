import { AppThunk } from "@/app/store";
import {
  AIRPORT_RENTS,
  COMPANY_RENTS,
  PAY_OUT_FROM_JAIL_AMOUNT,
} from "@backend/constants";
import { setLobbyRooms } from "@/slices/lobby-slice";
import {
  setPlayers,
  resetRoom,
  transferMoney,
  setRoom,
  suspendPlayer,
  drawChanceCard,
  movePlayer,
  staySuspendedTurn,
  freePlayer,
  setDices,
  incrementPlayerPosition,
  allowTurnActions,
  endPlayerTurn,
  setSelfPlayerReady,
} from "@/slices/game-slice";
import {
  resetUi,
  setHighlightProperties,
  setRoomUi,
  showToast,
  writeLog,
} from "@/slices/ui-slice";
import Player, { NewPlayer } from "@backend/types/Player";
import Room from "@backend/types/Room";
import { getGoTile, getJailTileIndex } from "@backend/helpers";
import { Socket } from "socket.io-client";
import { IJail, ITax, PurchasableTile, TileTypes } from "@backend/types/Board";
import { MS_TO_MOVE_ON_TILES } from "@/lib/constants";

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

  return (dispatch) => {
    socket.on("player_created", ({ players }: { players: Player[] }) => {
      dispatch(setSelfPlayerReady());
      dispatch(setPlayers(players));
    });

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

export const walkPlayer = (playerId: string, steps: number): AppThunk => {
  return (dispatch, getState) => {
    const interval = setInterval(() => {
      dispatch(incrementPlayerPosition({ playerId }));

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

      // when finished walking
      if (--steps === 0) {
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

    const {
      players,
      currentPlayerTurnId,
      suspendedPlayers,
      doublesInARow,
      map: { board },
    } = getState().game;
    const player = players.find((player) => player.id === socket.id);
    const isDouble = dices[0] === dices[1];
    const jailTileIndex = getJailTileIndex(board);

    if (!player) throw new Error(`Player was not found`);

    if (!currentPlayerTurnId)
      throw new Error(`Current turn is not belong to ${currentPlayerTurnId}`);

    // update suspended player
    if (
      suspendedPlayers[currentPlayerTurnId] !== undefined &&
      suspendedPlayers[currentPlayerTurnId].reason === TileTypes.JAIL
    ) {
      return !isDouble
        ? dispatch(handleStaySuspendedPlayer(currentPlayerTurnId))
        : dispatch(freePlayer({ playerId: currentPlayerTurnId }));
    }

    if (jailTileIndex !== -1 && doublesInARow === 3) {
      const jailTile = board[jailTileIndex] as IJail;

      dispatch(
        suspendPlayer({
          playerId: currentPlayerTurnId,
          suspensionLeft: jailTile.suspensionAmount,
          suspensionReason: TileTypes.JAIL,
        })
      );

      dispatch(
        movePlayer({
          playerId: currentPlayerTurnId,
          tilePosition: jailTileIndex,
        })
      );

      dispatch(writeLog(`${player.name} נשלח לכלא לאחר 3 דאבלים רצופים`));

      return socket.emit("switch_turn");
    }

    dispatch(
      walkPlayer(
        currentPlayerTurnId,
        dices.reduce((acc, dice) => acc + dice, 0)
      )
    );
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

export const handlePurchaseProperty = (
  socket: Socket,
  propertyPos: number
): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const tile = state.game.map.board[propertyPos] as PurchasableTile;

    const isAllowedToPurchase = state.game.players.find(
      (player) => player.id === socket.id && player.money >= tile.cost
    );

    if (!isAllowedToPurchase) {
      return dispatch(
        showToast({
          variant: "destructive",
          title: "נראה שאין לך מספיק כסף לבצע את הפעולה.",
        })
      );
    }

    // otherwise, process purchase
    socket.emit("purchase_property");
  };
};

export const handlePayOutOfJail = (socket: Socket): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();

    const canPayOutOfJail = state.game.players.find(
      (player) =>
        player.id === socket.id && player.money >= PAY_OUT_FROM_JAIL_AMOUNT
    );

    if (!canPayOutOfJail) {
      return dispatch(
        showToast({
          variant: "destructive",
          title: "נראה שאין לך מספיק כסף לבצע את הפעולה.",
        })
      );
    }

    // otherwise, process purchase
    socket.emit("pay_out_of_jail");
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

    switch (landedTile.type) {
      case TileTypes.GO:
        const goTile = getGoTile(map.board);

        dispatch(
          writeLog(
            `${player.name} נחת על ${goTile.name} והרוויח $${goRewardOnLand}`
          )
        );

        return dispatch(
          transferMoney({
            recieverId: playerId,
            amount: goRewardOnLand,
          })
        );
      case TileTypes.PROPERTY:
      case TileTypes.AIRPORT:
      case TileTypes.COMPANY:
        if (!landedTile.owner || landedTile.owner === playerId) return;

        return dispatch(handleRentPayment(player, landedTile));
      case TileTypes.CHANCE:
        dispatch(drawChanceCard());

        return dispatch(handleChanceCard(player));
      case TileTypes.TAX:
        return dispatch(handleTaxPayment(player, landedTile));
      case TileTypes.SURPRISE:
        return;
      case TileTypes.JAIL:
        return;
      case TileTypes.VACATION:
        dispatch(endPlayerTurn());

        dispatch(writeLog(`${player.name} יצא לחופשה`));

        return dispatch(
          suspendPlayer({
            playerId,
            suspensionReason: TileTypes.VACATION,
            suspensionLeft: landedTile.suspensionAmount,
          })
        );
      case TileTypes.GO_TO_JAIL:
        const jailTileIndex = getJailTileIndex(map.board);
        const jailTile = map.board[jailTileIndex] as IJail;

        if (!jailTile) {
          throw new Error("Jail tile not found on the board");
        }

        dispatch(
          movePlayer({ playerId: player.id, tilePosition: jailTileIndex })
        );

        dispatch(endPlayerTurn());

        dispatch(writeLog(`${player.name} נשלח לכלא`));

        return dispatch(
          suspendPlayer({
            playerId,
            suspensionReason: TileTypes.JAIL,
            suspensionLeft: jailTile.suspensionAmount,
          })
        );
    }
  };
};

export const handleChanceCard = (player: Player): AppThunk => {
  return (dispatch, getState) => {
    const { drawnChanceCard } = getState().game;

    if (!drawnChanceCard) throw new Error("No chance card was found.");

    // switch (drawChanceCard) {
    //   case
    // }
  };
};

export const handleTaxPayment = (player: Player, tile: ITax): AppThunk => {
  return (dispatch) => {
    if (!tile.taxRate) return;

    const rentAmount = Math.ceil((player.money * tile.taxRate) / 100);
    const canPayTheRent = player.money >= rentAmount;

    if (canPayTheRent) {
      dispatch(
        transferMoney({
          payerId: player.id,
          amount: rentAmount,
        })
      );
    } else {
      dispatch(handleBudgetOverrun(player));
    }
  };
};

export const handleRentPayment = (
  payer: Player,
  tile: PurchasableTile
): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const owner = state.game.players.find((player) => player.id === tile.owner);
    let rentAmount: number = 0;

    if (!owner) return;

    if (tile.type === TileTypes.PROPERTY) {
      rentAmount = tile.rent[tile.rentIndex];
    } else if (tile.type === TileTypes.AIRPORT) {
      const ownedAirportsCount = state.game.map.board.filter(
        (_tile) => _tile.type === TileTypes.AIRPORT && _tile.owner === owner.id
      ).length;

      rentAmount = AIRPORT_RENTS[ownedAirportsCount - 1];
    } else if (tile.type === TileTypes.COMPANY) {
      const ownedCompaniesCount = state.game.map.board.filter(
        (_tile) => _tile.type === TileTypes.COMPANY && _tile.owner === owner.id
      ).length;
      const rentIndexAmount = COMPANY_RENTS[ownedCompaniesCount - 1];

      rentAmount = Math.ceil((payer.money * rentIndexAmount) / 100);
    }

    const moneyAfterDeduction = payer.money - rentAmount;

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

    if (moneyAfterDeduction < 0) {
      dispatch(handleBudgetOverrun(payer));
    }
  };
};

export const handleBudgetOverrun = (player: Player): AppThunk => {
  return (dispatch) => {
    if (player.properties.length > 0) {
      dispatch(setHighlightProperties());
    } else {
      // need to handle bankruptcy
    }
  };
};
