import { RootState } from "@/app/store";
import {
  Player,
  Room,
  Board,
  IProperty,
  isProperty,
  isPurchasable,
  PurchasableTile,
  RentIndexes,
  SuspensionTileTypes,
  TileTypes,
  GameCard,
  SuspensionProps,
  TradeType,
  cycleNextItem,
  cyclicRangeNumber,
  RoomGameCards,
} from "@ziv-carmi/monopoly-utils";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
  isInRoom: boolean;
  isReady: boolean;
  roomHostId: string | null;
  players: Player[];
  map: {
    board: Board;
    chances: RoomGameCards;
    surprises: RoomGameCards;
    goRewards: {
      pass: number;
      land: number;
    };
  };
  started: boolean;
  dices: number[];
  cubesRolledInTurn: boolean;
  currentPlayerTurnId: string | null;
  isLanded: boolean;
  canPerformTurnActions: boolean;
  doublesInARow: number;
  suspendedPlayers: {
    [playerId: string]: SuspensionProps;
  };
  drawnGameCard: {
    tileIndex: number | null;
    card: GameCard | null;
  };
  winner: Player | null;
}

const initialState: GameState = {
  isInRoom: false,
  isReady: false,
  roomHostId: null,
  players: [],
  map: {
    board: [],
    chances: {
      cards: [],
      currentIndex: 0,
    },
    surprises: {
      cards: [],
      currentIndex: 0,
    },
    goRewards: {
      pass: 200,
      land: 300,
    },
  },
  started: false,
  dices: [],
  cubesRolledInTurn: false,
  currentPlayerTurnId: null,
  isLanded: false,
  canPerformTurnActions: true,
  doublesInARow: 0,
  suspendedPlayers: {},
  drawnGameCard: {
    tileIndex: null,
    card: null,
  },
  winner: null,
};

export type TransferMoneyArgs = {
  amount: number;
  payerId?: string;
  recieverId?: string;
} & ({ payerId: string } | { recieverId: string });

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      const room = action.payload;

      state.isInRoom = true;
      state.roomHostId = room.hostId;
      state.players = Object.values(room.players);
      state.map = room.map;
      state.started = room.gameStarted;
      state.dices = room.dices;
      state.currentPlayerTurnId = room.currentPlayerTurnId;
      state.doublesInARow = room.doublesInARow;
    },
    resetRoom: () => {
      return initialState;
    },
    setRoomHostId: (state, action: PayloadAction<string>) => {
      state.roomHostId = action.payload;
    },
    setSelfPlayerReady: (state) => {
      state.isReady = true;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
    },
    removePlayer: (state, action: PayloadAction<{ playerId: string }>) => {
      const player = state.players.filter(
        (player) => player.id !== action.payload.playerId
      );
      state.players = player;
    },
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    startGame: (
      state,
      action: PayloadAction<{
        generatedPlayers: Player[];
        currentPlayerTurn: string;
      }>
    ) => {
      state.players = action.payload.generatedPlayers;
      state.currentPlayerTurnId = action.payload.currentPlayerTurn;
      state.started = true;
    },
    setDices: (state, action: PayloadAction<{ dices: number[] }>) => {
      const { dices } = action.payload;
      const isDouble = dices[0] === dices[1];

      state.dices = dices;
      state.canPerformTurnActions = false;
      state.cubesRolledInTurn = true;
      state.doublesInARow = isDouble ? ++state.doublesInARow : 0;
    },
    setIsLanded: (state, action: PayloadAction<boolean>) => {
      state.isLanded = action.payload;
    },
    incrementPlayerPosition: (
      state,
      action: PayloadAction<{ playerId: string; incrementor: number }>
    ) => {
      const { playerId, incrementor } = action.payload;
      const boardLength = state.map.board.length;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex >= 0) {
        state.players[playerIndex].tilePos = cyclicRangeNumber(
          state.players[playerIndex].tilePos + incrementor,
          boardLength
        );
      }
    },
    movePlayer: (
      state,
      action: PayloadAction<{
        playerId: string;
        tilePosition: number;
      }>
    ) => {
      const { playerId, tilePosition } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex >= 0) {
        state.players[playerIndex].tilePos = tilePosition;
      }
    },
    allowTurnActions: (state, action: PayloadAction<boolean>) => {
      state.canPerformTurnActions = action.payload;
    },
    transferMoney: (state, action: PayloadAction<TransferMoneyArgs>) => {
      const { payerId, recieverId, amount } = action.payload;
      const payerIndex = state.players.findIndex(
        (player) => payerId && player.id === payerId
      );
      const recieverIndex = state.players.findIndex(
        (player) => recieverId && player.id === recieverId
      );

      if (payerIndex >= 0) {
        state.players[payerIndex].money -= amount;
      }

      if (recieverIndex >= 0) {
        state.players[recieverIndex].money += amount;
      }
    },
    completeTrade: (state, action: PayloadAction<TradeType>) => {
      const { offeror, offeree } = action.payload;
      const offerorIndex = state.players.findIndex(
        (player) => player.id === offeror.id
      );
      const offereeIndex = state.players.findIndex(
        (player) => player.id === offeree.id
      );

      const offerorProfit = -offeror.money + offeree.money;
      const offereeProfit = -offeree.money + offeror.money;

      // update offerror
      state.players[offerorIndex].money += offerorProfit;
      state.players[offerorIndex].debtTo =
        state.players[offerorIndex].money >= 0
          ? null
          : state.players[offerorIndex].debtTo;

      // update offeree
      state.players[offereeIndex].money += offereeProfit;
      state.players[offereeIndex].debtTo =
        state.players[offereeIndex].money >= 0
          ? null
          : state.players[offereeIndex].debtTo;

      // update board
      state.map.board = state.map.board.map((tile, tileIndex) => {
        if (isPurchasable(tile) && tile.owner) {
          // check if from player is owner & tile is on his offer
          if (offeror.properties.includes(tileIndex)) {
            tile.owner = offeree.id;
          }

          // check if to player is owner & tile is on his offer
          if (offeree.properties.includes(tileIndex)) {
            tile.owner = offeror.id;
          }
        }

        return tile;
      });
    },
    purchaseProperty: (
      state,
      action: PayloadAction<{ propertyIndex: number }>
    ) => {
      const { currentPlayerTurnId } = state;
      const { propertyIndex } = action.payload;
      const tile = state.map.board[propertyIndex] as PurchasableTile;
      const playerIndex = state.players.findIndex(
        (player) => player.id === currentPlayerTurnId
      );

      // update player
      if (playerIndex >= 0) {
        state.players[playerIndex].money -= tile.cost;
      }

      // update board
      if (tile) {
        tile.owner = currentPlayerTurnId;
        state.map.board[propertyIndex] = tile;
      }
    },
    sellProperty: (state, action: PayloadAction<{ propertyIndex: number }>) => {
      const { propertyIndex } = action.payload;
      const tile = state.map.board[propertyIndex] as PurchasableTile;
      const playerIndex = state.players.findIndex(
        (player) => player.id === state.currentPlayerTurnId
      );

      // update player
      if (playerIndex >= 0) {
        state.players[playerIndex].money += tile.cost / 2;
        state.players[playerIndex].debtTo =
          state.players[playerIndex].money >= 0
            ? null
            : state.players[playerIndex].debtTo;
      }

      // update board
      if (tile) {
        tile.owner = null;
        state.map.board[propertyIndex] = tile;
      }
    },
    setCityLevel: (
      state,
      action: PayloadAction<{
        propertyIndex: number;
        changeType: "upgrade" | "downgrade";
      }>
    ) => {
      const { propertyIndex, changeType } = action.payload;
      const tile = state.map.board[propertyIndex] as IProperty;
      const playerIndex = state.players.findIndex(
        (player) => player.id === state.currentPlayerTurnId
      );

      // update board
      if (tile) {
        tile.rentIndex =
          changeType === "upgrade" ? tile.rentIndex + 1 : tile.rentIndex - 1;
        state.map.board[propertyIndex] = tile;
      }

      // update player
      if (playerIndex >= 0) {
        const transactionAmount =
          tile.rentIndex === RentIndexes.HOTEL
            ? tile.hotelCost
            : tile.houseCost;
        if (changeType === "upgrade") {
          state.players[playerIndex].money -= transactionAmount;
        } else {
          state.players[playerIndex].money += transactionAmount / 2;
          state.players[playerIndex].debtTo =
            state.players[playerIndex].money >= 0
              ? null
              : state.players[playerIndex].debtTo;
        }
      }
    },
    suspendPlayer: (
      state,
      action: PayloadAction<{
        playerId: string;
        suspensionReason: SuspensionTileTypes;
        suspensionLeft: number;
      }>
    ) => {
      const { playerId, suspensionReason, suspensionLeft } = action.payload;

      state.suspendedPlayers[playerId] = {
        reason: suspensionReason,
        left: suspensionLeft,
      };
    },
    staySuspendedTurn: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;

      console.log(
        "before decreasing suspended turn state",
        current(state.suspendedPlayers)
      );

      if (state.suspendedPlayers[playerId] !== undefined) {
        state.suspendedPlayers[playerId].left -= 1;
      }

      console.log(
        "updated decreased suspended players state",
        current(state.suspendedPlayers)
      );
    },
    freePlayer: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;

      console.log(
        "freeing from suspension",
        current(state.suspendedPlayers[playerId])
      );

      delete state.suspendedPlayers[playerId];
    },
    resetCards: (state) => {
      state.drawnGameCard = {
        tileIndex: null,
        card: null,
      };
    },
    drawGameCard: (
      state,
      action: PayloadAction<{
        type: TileTypes.CHANCE | TileTypes.SURPRISE;
        tileIndex: number;
      }>
    ) => {
      const { chances, surprises } = state.map;

      state.drawnGameCard.tileIndex = action.payload.tileIndex;

      switch (action.payload.type) {
        case TileTypes.CHANCE:
          state.drawnGameCard.card = cycleNextItem({
            currentIndex: chances.currentIndex,
            array: chances.cards,
          });
          state.map.chances.currentIndex += 1;
          break;
        case TileTypes.SURPRISE:
          state.drawnGameCard.card = cycleNextItem({
            currentIndex: surprises.currentIndex,
            array: surprises.cards,
          });
          state.map.surprises.currentIndex += 1;
          break;
        default:
          break;
      }
    },
    switchTurn: (state, action: PayloadAction<{ nextPlayerId: string }>) => {
      const { nextPlayerId } = action.payload;

      state.currentPlayerTurnId = nextPlayerId;
      state.isLanded = false;
      state.canPerformTurnActions = true;
      state.cubesRolledInTurn = false;
      state.doublesInARow = 0;
    },
    setPlayerInDebt: (
      state,
      action: PayloadAction<{ playerId: string; debtTo: Player["debtTo"] }>
    ) => {
      const { playerId, debtTo } = action.payload;

      state.players.map((player) => {
        if (player.id === playerId) {
          player.debtTo = debtTo;
        }

        return player;
      });
    },
    bankruptPlayer: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;
      const player = state.players.find((player) => player.id === playerId);

      if (player) {
        // reset owned properties
        state.map.board.map((tile) => {
          if (isPurchasable(tile) && tile.owner === playerId) {
            const newOwner = player.debtTo === "bank" ? null : player.debtTo;
            tile.owner = newOwner;

            if (isProperty(tile)) {
              tile.rentIndex = RentIndexes.BLANK;
            }
          }

          return tile;
        });

        state.players = state.players.filter(
          (player) => player.id !== playerId
        );
      }
    },

    setWinner: (state, action: PayloadAction<{ winnerId: string }>) => {
      const winner = state.players.find(
        (player) => action.payload.winnerId === player.id
      );

      state.winner = winner || null;
    },
  },
});

export const {
  setRoom,
  resetRoom,
  setRoomHostId,
  setSelfPlayerReady,
  addPlayer,
  removePlayer,
  setPlayers,
  startGame,
  setDices,
  setIsLanded,
  incrementPlayerPosition,
  movePlayer,
  allowTurnActions,
  transferMoney,
  completeTrade,
  purchaseProperty,
  sellProperty,
  setCityLevel,
  suspendPlayer,
  staySuspendedTurn,
  freePlayer,
  resetCards,
  drawGameCard,
  switchTurn,
  setPlayerInDebt,
  bankruptPlayer,
  setWinner,
} = gameSlice.actions;

export const selectGameBoard = (state: RootState) => state.game.map.board;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectCurrentPlayerTurn = (state: RootState) =>
  state.game.players.find(
    (player) => player.id === state.game.currentPlayerTurnId
  );

export default gameSlice.reducer;
