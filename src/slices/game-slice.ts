import { RootState } from "@/app/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Colors,
  GameCard,
  GameCardDeck,
  GameSetting,
  GameState,
  GameStats,
  IProperty,
  PardonCard,
  Player,
  PurchasableTile,
  RentIndexes,
  Room,
  RoomGameCards,
  SuspensionTileTypes,
  TradeType,
  isProperty,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";

type StatsWithoutParticipants = Omit<GameStats, "participants">;
type _GameStats = StatsWithoutParticipants & { participants: Player[] };
type CardsWithPardonCardHolderAndDeck = Pick<
  RoomGameCards,
  "pardonCardHolder" | "deck"
>;
type MapWithoutCards = Omit<Room["map"], "chances" | "surprises">;
type _GameMap = MapWithoutCards & {
  surprises: CardsWithPardonCardHolderAndDeck;
  chances: CardsWithPardonCardHolderAndDeck;
};
export type GameLogType = { id: number; message: string; date: Date };
type RoomBase = Omit<Room, "players" | "stats" | "map"> & {
  stats: _GameStats;
};

export interface GameRoom extends RoomBase {
  isInRoom: boolean;
  players: Player[];
  selfPlayer: Player | null;
  isSpectating: boolean;
  drawnGameCard: {
    tileIndex: number | null;
    card: GameCard | null;
  };
  map: _GameMap;
  stats: _GameStats;
  gameLog: GameLogType[];
  selectedPopover: PurchasableTile | PardonCard | null;
}

const initialState: GameRoom = {
  id: "",
  isInRoom: false,
  players: [],
  selfPlayer: null,
  hostId: null,
  isSpectating: false,
  map: {
    chances: {
      pardonCardHolder: null,
      deck: GameCardDeck.CHANCE,
    },
    surprises: {
      pardonCardHolder: null,
      deck: GameCardDeck.SURPRISE,
    },
    board: [],
    goRewards: {
      pass: 200,
      land: 300,
    },
  },
  state: GameState.NOT_STARTED,
  dices: [],
  cubesRolledInTurn: false,
  forceNoAnotherTurn: false,
  currentPlayerId: null,
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
  voteKickers: [],
  gameLog: [],
  selectedPopover: null,
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

      return {
        ...room,
        isInRoom: true,
        players: Object.values(room.players),
        selfPlayer: state.selfPlayer,
        isSpectating: state.isSpectating,
        drawnGameCard: state.drawnGameCard,
        gameLog: state.gameLog,
        selectedPopover: state.selectedPopover,
        map: {
          ...room.map,
          chances: {
            deck: room.map.chances.deck,
            pardonCardHolder: room.map.chances.pardonCardHolder,
          },
          surprises: {
            deck: room.map.surprises.deck,
            pardonCardHolder: room.map.surprises.pardonCardHolder,
          },
        },
        stats: {
          ...room.stats,
          participants: Object.values(room.stats.participants),
        },
      };
    },
    resetRoom: () => {
      return initialState;
    },
    setHostId: (state, action: PayloadAction<Room["hostId"]>) => {
      state.hostId = action.payload;
    },
    setSelfPlayer: (state, action: PayloadAction<Player | null>) => {
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
    setPlayerColor: (
      state,
      action: PayloadAction<{ playerId: string; color: Colors }>
    ) => {
      const { playerId, color } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex >= 0) {
        state.players[playerIndex].color = color;
      }
    },
    setPlayerPosition: (
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
    setPlayerInDebt: (
      state,
      action: PayloadAction<{ playerId: string; debtTo: Player["debtTo"] }>
    ) => {
      const { playerId, debtTo } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex >= 0) {
        state.players[playerIndex].debtTo = debtTo;
      }
    },
    setPlayerBankrupt: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex !== -1) {
        state.players[playerIndex].bankrupted = true;
      }
    },
    addPlayer: (
      state,
      action: PayloadAction<{ player: Player; isSelf?: boolean }>
    ) => {
      const { player, isSelf } = action.payload;

      state.players = [...state.players, player];

      if (isSelf) {
        state.selfPlayer = player;
      }
    },
    removePlayer: (state, action: PayloadAction<{ playerId: string }>) => {
      state.players = state.players.filter(
        (player) => player.id !== action.payload.playerId
      );
    },
    startGame: (
      state,
      action: PayloadAction<{
        generatedPlayers: Player[];
        currentPlayerId: string;
      }>
    ) => {
      state.players = action.payload.generatedPlayers;
      state.currentPlayerId = action.payload.currentPlayerId;
      state.canPerformTurnActions = true;
      state.state = GameState.STARTED;
      state.stats = {
        participants: state.players,
        startedAt: new Date(),
      };
    },
    setCurrentPlayerVotekick: (
      state,
      action: PayloadAction<{ kickAt: Player["votekickedAt"] }>
    ) => {
      const { kickAt } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === state.currentPlayerId
      );

      if (playerIndex !== -1) {
        state.players[playerIndex].votekickedAt = kickAt;
      }
    },
    setDices: (state, action: PayloadAction<{ dices: number[] }>) => {
      const { dices } = action.payload;
      const isDouble = dices[0] === dices[1];

      state.dices = dices;
      state.canPerformTurnActions = false;
      state.cubesRolledInTurn = true;
      state.doublesInARow = isDouble ? ++state.doublesInARow : 0;
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
      const wereTradingPardonCards = traders.some(
        (trader) => trader.pardonCards.length > 0
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

      if (wereTradingPardonCards) {
        const { chances, surprises } = state.map;
        const firstTraderOfferedFromChances = firstPlayer.pardonCards.find(
          (pardonCard) => pardonCard.deck === chances.deck
        );
        const secondTraderOfferedFromChances = secondPlayer.pardonCards.find(
          (pardonCard) => pardonCard.deck === chances.deck
        );

        if (
          chances.pardonCardHolder === firstPlayer.id &&
          firstTraderOfferedFromChances
        ) {
          state.map.chances.pardonCardHolder = secondPlayer.id;
        }

        if (
          chances.pardonCardHolder === secondPlayer.id &&
          secondTraderOfferedFromChances
        ) {
          state.map.chances.pardonCardHolder = firstPlayer.id;
        }

        const firstTraderOfferedFromSurprises = firstPlayer.pardonCards.find(
          (pardonCard) => pardonCard.deck === surprises.deck
        );
        const secondTraderOfferedFromSurprises = secondPlayer.pardonCards.find(
          (pardonCard) => pardonCard.deck === surprises.deck
        );

        if (
          surprises.pardonCardHolder === firstPlayer.id &&
          firstTraderOfferedFromSurprises
        ) {
          state.map.surprises.pardonCardHolder = secondPlayer.id;
        }

        if (
          surprises.pardonCardHolder === secondPlayer.id &&
          secondTraderOfferedFromSurprises
        ) {
          state.map.surprises.pardonCardHolder = firstPlayer.id;
        }
      }
    },
    purchaseProperty: (
      state,
      action: PayloadAction<{ propertyIndex: number }>
    ) => {
      const { currentPlayerId } = state;
      const { propertyIndex } = action.payload;
      const tile = state.map.board[propertyIndex] as PurchasableTile;
      const playerIndex = state.players.findIndex(
        (player) => player.id === currentPlayerId
      );

      // update player
      if (playerIndex >= 0) {
        state.players[playerIndex].money -= tile.cost;

        // update board
        if (tile) {
          tile.owner = currentPlayerId;
          state.map.board[propertyIndex] = tile;
        }
      }
    },
    sellProperty: (state, action: PayloadAction<{ propertyIndex: number }>) => {
      const { currentPlayerId } = state;
      const { propertyIndex } = action.payload;
      const tile = state.map.board[propertyIndex] as PurchasableTile;
      const playerIndex = state.players.findIndex(
        (player) => player.id === currentPlayerId
      );

      // update player
      if (playerIndex >= 0) {
        state.players[playerIndex].money += tile.cost / 2;
        state.players[playerIndex].debtTo =
          state.players[playerIndex].money >= 0
            ? null
            : state.players[playerIndex].debtTo;

        // update board
        if (tile) {
          tile.owner = null;
          state.map.board[propertyIndex] = tile;
        }
      }
    },
    setCityLevel: (
      state,
      action: PayloadAction<{
        propertyIndex: number;
        changeType: "upgrade" | "downgrade";
      }>
    ) => {
      const { currentPlayerId } = state;
      const { propertyIndex, changeType } = action.payload;
      const tile = state.map.board[propertyIndex] as IProperty;
      const playerIndex = state.players.findIndex(
        (player) => player.id === currentPlayerId
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
        (player) => player.id === state.currentPlayerId
      );

      if (player) {
        state.drawnGameCard = {
          tileIndex: player.tilePos,
          card: action.payload,
        };
      }
    },
    switchTurn: (state, action: PayloadAction<{ nextPlayerId: string }>) => {
      const playerIndex = state.players.findIndex(
        (player) => player.id === state.currentPlayerId
      );

      if (playerIndex >= 0) {
        state.players[playerIndex].votekickedAt = null;
      }

      state.currentPlayerId = action.payload.nextPlayerId;
      state.canPerformTurnActions = true;
      state.cubesRolledInTurn = false;
      state.forceNoAnotherTurn = false;
      state.doublesInARow = 0;
      state.voteKickers = [];
    },
    setNoAnotherTurn: (state, action: PayloadAction<boolean>) => {
      state.forceNoAnotherTurn = action.payload;
    },
    resetOwner: (state, action: PayloadAction<{ playerId: string }>) => {
      const { playerId } = action.payload;
      const playerIndex = state.players.findIndex(
        (player) => player.id === playerId
      );

      if (playerIndex !== -1) {
        state.map.board = state.map.board.map((tile) => {
          if (isPurchasable(tile) && tile.owner === playerId) {
            tile.owner = null;

            if (isProperty(tile)) {
              tile.rentIndex = RentIndexes.BLANK;
            }
          }

          return tile;
        });
      }
    },
    clearPlayers: (state) => {
      state.players = state.players.map((player) => {
        player.connectionKickAt = null;
        player.votekickedAt = null;

        return player;
      });
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
    setVotekickers: (
      state,
      action: PayloadAction<{ votekickerId: string }>
    ) => {
      state.voteKickers = [...state.voteKickers, action.payload.votekickerId];
    },
    resetVotekickers: (state) => {
      state.voteKickers = [];
    },
    setPardonCardHolder: (
      state,
      action: PayloadAction<{
        holder: CardsWithPardonCardHolderAndDeck["pardonCardHolder"];
        deck: GameCardDeck;
      }>
    ) => {
      const { holder, deck } = action.payload;

      if (deck === GameCardDeck.SURPRISE) {
        state.map.surprises.pardonCardHolder = holder;
      } else {
        state.map.chances.pardonCardHolder = holder;
      }
    },
    writeLog: (state, action: PayloadAction<string>) => {
      state.gameLog.unshift({
        id: state.gameLog.length + 1,
        message: action.payload,
        date: new Date(),
      });
    },
    setSelectedPopover: (
      state,
      action: PayloadAction<PurchasableTile | PardonCard>
    ) => {
      state.selectedPopover = action.payload;
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
  setCurrentPlayerVotekick,
  addPlayer,
  setPlayerColor,
  removePlayer,
  startGame,
  setDices,
  setPlayerPosition,
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
  setNoAnotherTurn,
  resetOwner,
  setPlayerBankrupt,
  clearPlayers,
  setWinner,
  addTrade,
  updateTrade,
  removeTrade,
  setVotekickers,
  resetVotekickers,
  setPardonCardHolder,
  writeLog,
  setSelectedPopover,
} = gameSlice.actions;

export const selectGameBoard = (state: RootState) => state.game.map.board;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectCurrentPlayerTurn = (state: RootState) =>
  state.game.players.find((player) => player.id === state.game.currentPlayerId);
export const selectSelectedTileIndex = (state: RootState) =>
  state.game.map.board.findIndex(
    (tile) =>
      state.game.selectedPopover &&
      isPurchasable(state.game.selectedPopover) &&
      tile.name === state.game.selectedPopover.name
  );

export default gameSlice.reducer;
