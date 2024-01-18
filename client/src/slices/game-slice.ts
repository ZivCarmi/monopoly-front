import { RootState } from "@/app/store";
import Player from "@backend/types/Player";
import Room from "@backend/classes/Room";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { TURN_TIMES } from "@/utils/constants";
import {
  Board,
  IProperty,
  isProperty,
  isPurchasable,
  PurchasableTile,
  RentIndexes,
  SuspensionTileTypes,
  TileTypes,
} from "@backend/types/Board";
import { GameCard } from "@backend/types/Cards";
import { SuspensionProps, TradeType } from "@backend/types/Game";
import { cycleNextItem, cyclicRangeNumber } from "@backend/utils";
import { RoomGameCards } from "@backend/types/Game";

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
  forceEndTurn: boolean;
  suspendedPlayers: {
    [playerId: string]: SuspensionProps;
  };
  drawnGameCard: GameCard | null;
  counter: number;
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
  forceEndTurn: false,
  suspendedPlayers: {},
  drawnGameCard: null,
  counter: TURN_TIMES.rollDices,
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
      const boardLength = state.map.board.length;
      const { playerId, incrementor } = action.payload;
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

      // update traded players
      state.players[offerorIndex].money += offerorProfit;
      state.players[offereeIndex].money += offereeProfit;

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
        state.players[playerIndex].properties.push(propertyIndex);
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
      const playerProperties = state.players[playerIndex].properties;

      // update player
      if (playerIndex >= 0) {
        state.players[playerIndex].money += tile.cost / 2;
        state.players[playerIndex].properties = playerProperties.filter(
          (tileIndex) => tileIndex !== propertyIndex
        );
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
    endPlayerTurn: (state) => {
      state.forceEndTurn = true;
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
      state.drawnGameCard = null;
    },
    drawGameCard: (
      state,
      action: PayloadAction<{ type: TileTypes.CHANCE | TileTypes.SURPRISE }>
    ) => {
      const { chances, surprises } = state.map;

      switch (action.payload.type) {
        case TileTypes.CHANCE:
          state.drawnGameCard = cycleNextItem({
            currentIndex: chances.currentIndex,
            array: chances.cards,
          });
          state.map.chances.currentIndex += 1;
          break;
        case TileTypes.SURPRISE:
          state.drawnGameCard = cycleNextItem({
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
      state.forceEndTurn = false;
      state.cubesRolledInTurn = false;
      state.doublesInARow = 0;
    },
    bankruptPlayer: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;

      state.players = state.players.filter((player) => player.id !== playerId);

      // reset owned properties
      state.map.board = state.map.board.map((tile) => {
        if (isPurchasable(tile) && tile.owner === playerId) {
          tile.owner = null;

          if (isProperty(tile)) {
            tile.rentIndex = RentIndexes.BLANK;
          }
        }

        return tile;
      });
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
  endPlayerTurn,
  freePlayer,
  resetCards,
  drawGameCard,
  switchTurn,
  bankruptPlayer,
  setWinner,
} = gameSlice.actions;

export const selectGameBoard = (state: RootState) => state.game.map.board;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectDices = (state: RootState) => state.game.dices;
export const selectCurrentPlayerTurn = (state: RootState) =>
  state.game.players.find(
    (player) => player.id === state.game.currentPlayerTurnId
  );

export default gameSlice.reducer;
