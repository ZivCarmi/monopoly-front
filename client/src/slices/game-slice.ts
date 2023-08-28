import { RootState } from "@/app/store";
import Player from "@backend/types/Player";
import Room from "@backend/types/Room";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { TURN_TIMES } from "@/lib/constants";
import Board, { PurchasableTile } from "@backend/types/Board";
import { SuspensionReasons } from "@backend/types/Game";
import { cycleNextItem, cyclicRangeNumber } from "@backend/utils";

export interface GameState {
  isInRoom: boolean;
  isReady: boolean;
  roomHostId: string | null;
  players: Player[];
  map: {
    board: Board;
    chances: {
      cards: {}[];
      currentIndex: number;
    };
    goRewards: {
      pass: number;
      land: number;
    };
  };
  started: boolean;
  dices: number[];
  cubesRolledInTurn: boolean;
  currentPlayerTurnId: string | null;
  canPerformTurnActions: boolean;
  doublesInARow: number;
  forceEndTurn: boolean;
  suspendedPlayers: {
    [playerId: string]: {
      reason: SuspensionReasons;
      left: number;
    };
  };
  drawnChanceCard: {} | null;
  counter: number;
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
    goRewards: {
      pass: 200,
      land: 300,
    },
  },
  started: false,
  dices: [],
  cubesRolledInTurn: false,
  currentPlayerTurnId: null,
  canPerformTurnActions: true,
  doublesInARow: 0,
  forceEndTurn: false,
  suspendedPlayers: {},
  drawnChanceCard: null,
  counter: TURN_TIMES.rollDices,
};

type TransferMoneyArgs = {
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
    incrementPlayerPosition: (
      state,
      action: PayloadAction<{ playerId: string }>
    ) => {
      const boardLength = state.map.board.length;
      const { playerId } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex >= 0) {
        state.players[playerIndex].tilePos = cyclicRangeNumber(
          state.players[playerIndex].tilePos + 1,
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
        (player) => player.id === payerId
      );
      const recieverIndex = state.players.findIndex(
        (player) => player.id === recieverId
      );

      if (payerIndex >= 0) {
        state.players[payerIndex].money -= amount;
      }

      if (recieverIndex >= 0) {
        state.players[recieverIndex].money += amount;
      }
    },
    purchaseProperty: (
      state,
      action: PayloadAction<{
        playerId: string;
        tileIndex: number;
      }>
    ) => {
      const { playerId, tileIndex } = action.payload;
      const tile = state.map.board[tileIndex] as PurchasableTile;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      // update player
      if (playerIndex >= 0) {
        state.players[playerIndex].money -= tile.cost;
        state.players[playerIndex].properties.push(tileIndex);
      }

      // update board
      if (tile) {
        tile.owner = playerId;
        state.map.board[tileIndex] = tile;
      }
    },
    suspendPlayer: (
      state,
      action: PayloadAction<{
        playerId: string;
        suspensionReason: SuspensionReasons;
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
    freePlayer: (
      state,
      action: PayloadAction<{
        playerId: string;
        forceEndTurn?: boolean | undefined;
      }>
    ) => {
      const { playerId, forceEndTurn } = action.payload;

      console.log(
        "before update suspended players state",
        current(state.suspendedPlayers)
      );

      delete state.suspendedPlayers[playerId];

      state.forceEndTurn = forceEndTurn ? forceEndTurn : false;

      console.log(
        "updated suspended players state",
        current(state.suspendedPlayers)
      );
    },
    resetCards: (state) => {
      state.drawnChanceCard = null;
    },
    drawChanceCard: (state) => {
      const { cards: chanceCards, currentIndex } = state.map.chances;

      state.drawnChanceCard = cycleNextItem(currentIndex, chanceCards);
      state.map.chances.currentIndex += 1;
    },
    switchTurn: (state, action: PayloadAction<{ nextPlayerId: string }>) => {
      const { nextPlayerId } = action.payload;

      state.currentPlayerTurnId = nextPlayerId;
      state.canPerformTurnActions = true;
      state.forceEndTurn = false;
      state.cubesRolledInTurn = false;
      state.doublesInARow = 0;
    },
  },
});

export const {
  setRoom,
  resetRoom,
  setSelfPlayerReady,
  setPlayers,
  startGame,
  setDices,
  incrementPlayerPosition,
  movePlayer,
  allowTurnActions,
  transferMoney,
  purchaseProperty,
  suspendPlayer,
  staySuspendedTurn,
  endPlayerTurn,
  freePlayer,
  resetCards,
  drawChanceCard,
  switchTurn,
} = gameSlice.actions;

export const selectGameBoard = (state: RootState) => state.game.map.board;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectDices = (state: RootState) => state.game.dices;
export const selectCurrentPlayerTurn = (state: RootState) =>
  state.game.players.find(
    (player) => player.id === state.game.currentPlayerTurnId
  );

export default gameSlice.reducer;
