import store from "@/app/store";
import { BoardRaw, MappedPlayersByTiles, rowClassname } from "@/types/Board";
import {
  CountryIds,
  GameTile,
  IProperty,
  RentIndexes,
  SuspensionProps,
  TileTypes,
  TradeType,
  isProperty,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// create board that contains 10 tiles in a each row
export const createBoard = () => {
  const { board } = store.getState().game.map;
  const boardRows: BoardRaw = [];
  let rowTiles: GameTile[] = [];
  let counter = 0;

  board.forEach((tile) => {
    rowTiles.push(tile);

    if (rowTiles.length === board.length / 4) {
      boardRows.push({ area: rowClassname[counter], tiles: rowTiles });
      rowTiles = [];
      counter++;
    }
  });

  return boardRows;
};

export const mapPlayersOnBoard = () => {
  const { players } = store.getState().game;
  const initialMap: MappedPlayersByTiles = {};

  players.map((player) => {
    if (initialMap[player.tilePos] === undefined) {
      initialMap[player.tilePos] = [player];
    } else {
      initialMap[player.tilePos] = [...initialMap[player.tilePos], player];
    }
  });

  return initialMap;
};

export const isHost = (playerId: string) => {
  const { hostId } = store.getState().game;

  return playerId === hostId;
};

export const isPlayer = (playerId: string) => {
  const player = store
    .getState()
    .game.players.find((player) => player.id === playerId);

  return player;
};

export const isPlayerTurn = (playerId: string) => {
  const state = store.getState();
  const player = state.game.players.find((player) => player.id === playerId);

  if (!player) return false;

  return state.game.currentPlayerTurnId === player.id;
};

export const isPlayerSuspended = (
  playerId: string
): SuspensionProps | undefined => {
  return store.getState().game.suspendedPlayers[playerId];
};

export const isPlayerInJail = (playerId: string) => {
  const suspendedPlayer = store.getState().game.suspendedPlayers[playerId];

  if (!suspendedPlayer) return false;

  return suspendedPlayer.reason === TileTypes.JAIL;
};

export const isPlayerInDebt = (playerId: string) => {
  const { players } = store.getState().game;
  const player = players.find((player) => player.id === playerId);

  if (!player || player.money >= 0) return null;

  return player;
};

export const getCities = (countryId: CountryIds) => {
  const { board } = store.getState().game.map;

  return board.filter(
    (tile): tile is IProperty =>
      isProperty(tile) && tile.country.id === countryId
  );
};

export const hasBuildings = (countryId: CountryIds) => {
  return getCities(countryId).some(
    (city) => city.rentIndex !== RentIndexes.BLANK
  );
};

export const getPlayerPropertiesId = (ownerId: string) => {
  const { board } = store.getState().game.map;
  const propertiesId: number[] = [];

  for (let tileIndex = 0; tileIndex < board.length; tileIndex++) {
    const tile = board[tileIndex];

    if (isPurchasable(tile) && tile.owner === ownerId) {
      propertiesId.push(tileIndex);
    }
  }

  return propertiesId;
};

export const getPlayerName = (playerId: string) => {
  const { players } = store.getState().game;
  const player = players.find((player) => player.id === playerId);

  return player?.name ? player.name : "";
};

export const getPlayerColor = (playerId: string) => {
  const { players } = store.getState().game;
  const player = players.find((player) => player.id === playerId);

  return player?.color;
};

export const getPlayerMoney = (playerId: string) => {
  const { players } = store.getState().game;
  const player = players.find((player) => player.id === playerId);

  return player?.money;
};

export const getTimeValues = (countDown: number) => {
  const minutes = ("0" + Math.floor((countDown / 60000) % 60)).slice(-2);
  const seconds = ("0" + Math.floor((countDown / 1000) % 60)).slice(-2);

  return { minutes, seconds };
};

export const createTrade = (offerorId: string, offereeId: string) => {
  const newTrade: TradeType = {
    id: "",
    turn: offerorId,
    traders: [
      {
        id: offerorId,
        money: 0,
        properties: [],
      },
      {
        id: offereeId,
        money: 0,
        properties: [],
      },
    ],
    createdBy: offerorId,
    lastEditBy: offerorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return newTrade;
};

export const isParticipatingInTrade = (tradeId: string, playerId: string) => {
  const { trades } = store.getState().game;
  const trade = trades.find((_trade) => _trade.id === tradeId);

  if (!trade) return false;

  return trade.traders.some((trader) => trader.id === playerId);
};

export const isOwner = (
  playerId: string,
  propertyIndex: number[] | number
): boolean => {
  const {
    map: { board },
  } = store.getState().game;

  // checks if every passed properties belongs to the socket
  if (Array.isArray(propertyIndex)) {
    return propertyIndex.every((propertyIdx) => {
      const property = board[propertyIdx];

      if (isPurchasable(property) && property.owner === playerId) {
        return true;
      }

      return false;
    });
  }

  const property = board[propertyIndex];

  return isPurchasable(property) && property.owner === playerId;
};

export const isValidOffer = (trade: TradeType) => {
  return trade.traders.some((trader) => {
    if (trader.money > 0 || trader.properties.length > 0) {
      return true;
    }

    return false;
  });
};

// check if both players can fulfill the offer
export const isValidTrade = (trade: TradeType) => {
  return trade.traders.every((trader) => {
    const playerId = trader.id;
    const player = isPlayer(playerId);
    const didOfferMoney = trader.money > 0;
    const didOfferProperties = trader.properties.length > 0;

    // check if player exist
    if (!player) return false;

    // check if player has enough money
    if (didOfferMoney && player.money < trader.money) return false;

    // check if player has all the properties
    if (didOfferProperties && !isOwner(playerId, trader.properties))
      return false;

    return true;
  });
};
