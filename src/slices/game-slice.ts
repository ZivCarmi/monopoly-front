import { RootState } from "@/app/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  GameCard,
  GameSetting,
  GameState,
  IProperty,
  Player,
  PurchasableTile,
  RentIndexes,
  Room,
  SuspensionTileTypes,
  TileTypes,
  TradeType,
  cycleNextItem,
  isProperty,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";

type RoomWithoutParticipants = Omit<Room["stats"], "participants">;

type RoomBase = Omit<Room, "players" | "stats" | "id"> &
  RoomWithoutParticipants;

export interface GameRoom extends RoomBase {
  players: Player[];
  isInRoom: boolean;
  selfPlayer: Player | null;
  isSpectating: boolean;
  drawnGameCard: {
    tileIndex: number | null;
    card: GameCard | null;
  };
  stats: RoomWithoutParticipants & { participants: Player[] };
}

const initialState: GameRoom = {
  isInRoom: false,
  hostId: null,
  players: [],
  selfPlayer: null,
  isSpectating: false,
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
  state: GameState.NOT_STARTED,
  dices: [],
  cubesRolledInTurn: false,
  currentPlayerTurnId: null,
  canPerformTurnActions: false,
  doublesInARow: 0,
  suspendedPlayers: {},
  drawnGameCard: {
    tileIndex: null,
    card: null,
  },
  stats: {
    participants: [],
  },
  trades: [],
  settings: {
    isPrivate: false,
    maxPlayers: 4,
    startingMoney: 1500,
    randomizePlayerOrder: true,
    noRentInPrison: false,
  },
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
      state.hostId = room.hostId;
      state.players = Object.values(room.players);
      state.map = room.map;
      state.state = room.state;
      state.dices = room.dices;
      state.currentPlayerTurnId = room.currentPlayerTurnId;
      state.canPerformTurnActions = room.canPerformTurnActions;
      state.cubesRolledInTurn = room.cubesRolledInTurn;
      state.doublesInARow = room.doublesInARow;
      state.suspendedPlayers = room.suspendedPlayers;
      state.stats = {
        ...room.stats,
        participants: Object.values(room.stats.participants),
      };
      state.trades = room.trades;
      state.settings = room.settings;
    },
    resetRoom: () => {
      return initialState;
    },
    setHostId: (state, action: PayloadAction<string>) => {
      state.hostId = action.payload;
    },
    setSelfPlayer: (state, action: PayloadAction<Player>) => {
      state.selfPlayer = action.payload;
    },
    setIsSpectating: (state, action: PayloadAction<boolean>) => {
      state.isSpectating = action.payload;
    },
    setGameSetting: (state, action: PayloadAction<GameSetting>) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    setPlayerConnection: (
      state,
      action: PayloadAction<{
        playerId: string;
        isConnected: boolean;
        kickAt: Player["connectionKickAt"];
      }>
    ) => {
      const { playerId, isConnected, kickAt } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex !== -1) {
        state.players[playerIndex].isConnected = isConnected;
        state.players[playerIndex].connectionKickAt = kickAt;
      }
    },
    addPlayer: (
      state,
      action: PayloadAction<{ player: Player; isSelf?: boolean }>
    ) => {
      const { player, isSelf } = action.payload;
      state.players.push(player);
      if (isSelf) {
        state.selfPlayer = player;
      }
    },
    removePlayer: (state, action: PayloadAction<{ playerId: string }>) => {
      const player = state.players.filter(
        (player) => player.id !== action.payload.playerId
      );
      state.players = player;
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
      state.canPerformTurnActions = true;
      state.state = GameState.STARTED;
    },
    setDices: (state, action: PayloadAction<{ dices: number[] }>) => {
      const { dices } = action.payload;
      const isDouble = dices[0] === dices[1];

      state.dices = dices;
      state.canPerformTurnActions = false;
      state.cubesRolledInTurn = true;
      state.doublesInARow = isDouble ? ++state.doublesInARow : 0;
    },
    EXPERIMENTAL_incrementPlayerPosition: (
      state,
      action: PayloadAction<{ playerId: string; position: number }>
    ) => {
      const { playerId, position } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex >= 0) {
        state.players[playerIndex].tilePos = position;
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
      const { traders } = action.payload;
      const firstPlayer = traders[0];
      const secondPlayer = traders[1];
      const wereTradingMoney = traders.some((trader) => trader.money > 0);
      const wereTradingProperties = traders.some(
        (trader) => trader.properties.length > 0
      );

      const firstPlayerIndex = state.players.findIndex(
        (player) => player.id === firstPlayer.id
      );
      const secondPlayerIndex = state.players.findIndex(
        (player) => player.id === secondPlayer.id
      );

      if (wereTradingMoney) {
        const firstPlayerProfit = -firstPlayer.money + secondPlayer.money;
        const secondPlayerProfit = -secondPlayer.money + firstPlayer.money;

        // update first player
        state.players[firstPlayerIndex].money += firstPlayerProfit;
        state.players[firstPlayerIndex].debtTo =
          state.players[firstPlayerIndex].money >= 0
            ? null
            : state.players[firstPlayerIndex].debtTo;

        // update second player
        state.players[secondPlayerIndex].money += secondPlayerProfit;
        state.players[secondPlayerIndex].debtTo =
          state.players[secondPlayerIndex].money >= 0
            ? null
            : state.players[secondPlayerIndex].debtTo;
      }

      // update board
      if (wereTradingProperties) {
        state.map.board = state.map.board.map((tile, tileIndex) => {
          if (isPurchasable(tile) && tile.owner) {
            // set second player as the new owner
            if (firstPlayer.properties.includes(tileIndex)) {
              tile.owner = secondPlayer.id;
            }

            // set first player as the new owner
            if (secondPlayer.properties.includes(tileIndex)) {
              tile.owner = firstPlayer.id;
            }
          }

          return tile;
        });
      }
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

      if (state.suspendedPlayers[playerId] !== undefined) {
        state.suspendedPlayers[playerId].left -= 1;
      }
    },
    freePlayer: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;

      delete state.suspendedPlayers[playerId];
    },
    resetCards: (state) => {
      state.drawnGameCard = {
        tileIndex: null,
        card: null,
      };
    },
    EXPERIMENTAL_setGameCard: (state, action: PayloadAction<GameCard>) => {
      const player = state.players.find(
        (player) => player.id === state.currentPlayerTurnId
      );

      if (player) {
        state.drawnGameCard = {
          tileIndex: player.tilePos,
          card: action.payload,
        };
      }
    },
    switchTurn: (state, action: PayloadAction<{ nextPlayerId: string }>) => {
      const { nextPlayerId } = action.payload;

      state.currentPlayerTurnId = nextPlayerId;
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
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex !== -1) {
        const player = state.players[playerIndex];

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

        state.players[playerIndex].bankrupted = true;
      }
    },
    setWinner: (state, action: PayloadAction<{ winner: Player }>) => {
      state.stats.winner = action.payload.winner;
      state.stats.endedAt = new Date();
      state.state = GameState.ENDED;
    },
    addTrade: (state, action: PayloadAction<TradeType>) => {
      state.trades = [...state.trades, action.payload];
    },
    updateTrade: (state, action: PayloadAction<TradeType>) => {
      const trade = action.payload;
      const tradeIndex = state.trades.findIndex(
        (_trade) => _trade.id === trade.id
      );

      if (tradeIndex !== -1) {
        state.trades[tradeIndex] = trade;
      }
    },
    removeTrade: (state, action: PayloadAction<{ tradeId: string }>) => {
      state.trades = state.trades.filter(
        (trade) => trade.id !== action.payload.tradeId
      );
    },
  },
});

export const {
  setRoom,
  resetRoom,
  setHostId,
  setSelfPlayer,
  setIsSpectating,
  setGameSetting,
  setPlayerConnection,
  addPlayer,
  removePlayer,
  startGame,
  setDices,
  EXPERIMENTAL_incrementPlayerPosition,
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
  EXPERIMENTAL_setGameCard,
  switchTurn,
  setPlayerInDebt,
  bankruptPlayer,
  setWinner,
  addTrade,
  updateTrade,
  removeTrade,
} = gameSlice.actions;

export const selectGameBoard = (state: RootState) => state.game.map.board;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectCurrentPlayerTurn = (state: RootState) =>
  state.game.players.find(
    (player) => player.id === state.game.currentPlayerTurnId
  );

export default gameSlice.reducer;
