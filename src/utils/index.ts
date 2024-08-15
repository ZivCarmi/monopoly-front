import { BASE_URL } from "@/api/config";
import store from "@/app/store";
import {
  BoardRaw,
  BoardRow,
  MappedPlayersByTiles,
  OppositeSide,
  rowSide,
} from "@/types/Board";
import {
  CreateTradeArgs,
  TradeErrorReason,
  TradeValidityData,
} from "@/types/Trade";
import {
  Colors,
  Countries,
  GameTile,
  IAirport,
  ICompany,
  IProperty,
  PardonCard,
  PurchasableTile,
  RentIndexes,
  SuspensionProps,
  TileTypes,
  TradeType,
  isAirport,
  isCompany,
  isGameStarted,
  isProperty,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOppositeBoardSide = (side: BoardRow) => {
  const oppositeSides: OppositeSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };

  return oppositeSides[side];
};

// create board that contains 10 tiles in a each row
export const createBoard = () => {
  const { board } = store.getState().game.map;
  const boardRows: BoardRaw = [];
  let rowTiles: GameTile[] = [];
  let counter = 0;

  board.forEach((tile) => {
    rowTiles.push(tile);

    if (rowTiles.length === board.length / 4) {
      boardRows.push({ area: rowSide[counter], tiles: rowTiles });
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
  const player = isPlayer(playerId);

  if (!player) return false;

  return state.game.currentPlayerId === player.id;
};

export const isPlayerSuspended = (
  playerId: string
): SuspensionProps | undefined => {
  return store.getState().game.suspendedPlayers[playerId];
};

export const isPlayerInJail = (playerId: string) => {
  const suspendedPlayer = isPlayerSuspended(playerId);

  if (!suspendedPlayer) return false;

  return suspendedPlayer.reason === TileTypes.JAIL;
};

export const isPlayerInDebt = (playerId: string) => {
  const player = isPlayer(playerId);

  if (!player || player.money >= 0) return null;

  return player;
};

export const isPlayerCanUpgrade = (playerId: string, property: IProperty) => {
  const canUpgrade = { isValid: false, error: "" };
  const player = isPlayer(playerId);
  const upgradeCost =
    property.rentIndex === RentIndexes.FOUR_HOUSES
      ? property.hotelCost
      : property.houseCost;

  if (!player) return canUpgrade;

  if (!isPlayerTurn(playerId)) {
    canUpgrade.error = "באפשרותך לשדרג נכסים רק בתורך";
    return canUpgrade;
  }

  if (isPlayerSuspended(playerId)) {
    canUpgrade.error = "אין באפשרותך לשדרג נכסים כשאתה נמצא בכלא";
    return canUpgrade;
  }

  if (player.money < upgradeCost) {
    canUpgrade.error = "אין ברשותך מספיק כסף כדי לשדרג נכס זה";
    return canUpgrade;
  }

  if (property.rentIndex === RentIndexes.HOTEL) {
    canUpgrade.error = "הנכס נמצא ברמה הגבוהה ביותר שלו";
    return canUpgrade;
  }

  canUpgrade.isValid = true;

  return canUpgrade;
};

export const isPlayerCanDowngrade = (playerId: string, property: IProperty) => {
  const canDowngrade = { isValid: false, error: "" };
  const player = isPlayer(playerId);

  if (!player) return canDowngrade;

  if (!isPlayerTurn(playerId)) {
    canDowngrade.error = "באפשרותך לשנמך נכסים רק בתורך";
    return canDowngrade;
  }

  if (isPlayerSuspended(playerId)) {
    canDowngrade.error = "אין באפשרותך לשנמך נכסים כשאתה נמצא בכלא";
    return canDowngrade;
  }

  if (property.rentIndex === RentIndexes.BLANK) {
    canDowngrade.error = "הנכס נמצא ברמה הנמוכה ביותר שלו";
    return canDowngrade;
  }

  canDowngrade.isValid = true;

  return canDowngrade;
};

export const isPlayerCanSell = (
  playerId: string,
  property: PurchasableTile
) => {
  const { canPerformTurnActions } = store.getState().game;
  const canSell = { isValid: false, error: "" };
  const player = isPlayer(playerId);

  if (!player) return canSell;

  if (!isPlayerTurn(playerId)) {
    canSell.error = "באפשרותך למכור נכס רק בתורך";
    return canSell;
  }

  if (isPlayerSuspended(playerId)) {
    canSell.error = "אין באפשרותך למכור נכס כשאתה נמצא בכלא";
    return canSell;
  }

  if (isProperty(property) && hasBuildings(property.country.id)) {
    canSell.error = "אין באפשרותך למכור נכס עם בניינים עליו או על נכסים סמוכים";
    return canSell;
  }

  if (canPerformTurnActions) {
    canSell.isValid = true;
  }

  return canSell;
};

export const isInIdleRoom = () => {
  const { isInRoom, state } = store.getState().game;

  return isInRoom && !isGameStarted(state);
};

export const isSelfPlayerParticipating = () => {
  const { isInRoom, selfPlayer, state } = store.getState().game;

  return isInRoom && isGameStarted(state) && !!selfPlayer;
};

export const getCities = (countryId: Countries) => {
  const { board } = store.getState().game.map;

  return board.filter(
    (tile): tile is IProperty =>
      isProperty(tile) && tile.country.id === countryId
  );
};

export const getBoardAirports = () => {
  const { board } = store.getState().game.map;

  return board.filter((tile): tile is IAirport => isAirport(tile));
};

export const getBoardCompanies = () => {
  const { board } = store.getState().game.map;

  return board.filter((tile): tile is ICompany => isCompany(tile));
};

export const hasBuildings = (countryId: Countries) => {
  return getCities(countryId).some(
    (city) => city.rentIndex !== RentIndexes.BLANK
  );
};

export const getPlayerPurchasables = (playerId: string) => {
  const { board } = store.getState().game.map;

  const playerProperties = board.filter(
    (tile) => isPurchasable(tile) && tile.owner === playerId
  );

  return playerProperties as PurchasableTile[];
};

export const getPlayerAirports = (playerId: string) => {
  const playerAirports = getBoardAirports().filter(
    (airport) => airport.owner === playerId
  );

  return playerAirports as IAirport[];
};

export const getPlayerCompanies = (playerId: string) => {
  const playerCompanies = getBoardCompanies().filter(
    (company) => company.owner === playerId
  );

  return playerCompanies as ICompany[];
};

export const getPlayerPardonCards = (playerId: string) => {
  const { chances, surprises } = store.getState().game.map;
  const pardonCards: PardonCard[] = [];

  if (chances.pardonCardHolder === playerId) {
    pardonCards.push({ deck: chances.deck });
  }

  if (surprises.pardonCardHolder === playerId) {
    pardonCards.push({ deck: surprises.deck });
  }

  return pardonCards;
};

export const getPlayerName = (playerId: string) => {
  const player = isPlayer(playerId);

  return player?.name ? player.name : "";
};

export const getPlayerColor = (playerId: string) => {
  const player = isPlayer(playerId);

  return player?.color;
};

export const getPlayerMoney = (playerId: string) => {
  const player = isPlayer(playerId);

  return player?.money;
};

export const getTimeValues = (countDown: number) => {
  const minutes = ("0" + Math.floor((countDown / 60000) % 60)).slice(-2);
  const seconds = ("0" + Math.floor((countDown / 1000) % 60)).slice(-2);

  return { minutes, seconds };
};

export const generateTrade = ({ offerorId, offereeId }: CreateTradeArgs) => {
  const newTrade: TradeType = {
    id: "",
    turn: offerorId,
    traders: [
      {
        id: offerorId,
        money: 0,
        properties: [],
        pardonCards: [],
      },
      {
        id: offereeId,
        money: 0,
        properties: [],
        pardonCards: [],
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
    if (
      trader.money > 0 ||
      trader.properties.length > 0 ||
      trader.pardonCards.length > 0
    ) {
      return true;
    }

    return false;
  });
};

// check if both players can fulfill the offer
export const isValidTrade = (trade: TradeType): TradeValidityData => {
  let errorMessage = "";
  let errorPlayerId = "";
  let errorReason: TradeErrorReason = "";
  const isValid = trade.traders.every((trader) => {
    const playerId = trader.id;
    const player = isPlayer(playerId);
    const didOfferMoney = trader.money > 0;
    const didOfferProperties = trader.properties.length > 0;

    // check if player exist
    if (!player) {
      errorPlayerId = trader.id;
      errorMessage = "לא נמצא במשחק";

      return false;
    }

    // check if player has enough money
    if (didOfferMoney && player.money < trader.money) {
      errorPlayerId = trader.id;
      errorMessage = "אין מספיק כסף כדי לבצע את העסקה";
      errorReason = "money";

      return false;
    }

    // check if player has all the properties
    if (didOfferProperties && !isOwner(playerId, trader.properties)) {
      errorPlayerId = trader.id;
      errorMessage = "אין את כל הנכסים שנבחרו";
      errorReason = "properties";

      return false;
    }

    return true;
  });

  if (isValid) {
    return { valid: true, tradeId: trade.id };
  }

  return {
    valid: false,
    tradeId: trade.id,
    error: {
      reason: errorReason,
      message: errorMessage,
      playerId: errorPlayerId,
    },
  };
};

export const getAllColors = () => Object.values(Colors);

export const getAvailableColors = () => {
  const { players } = store.getState().game;
  const colors = Object.keys(Colors);
  const takenColors = players.map(({ color }) => color.toLowerCase());
  const availableColors: string[] = [];

  colors.forEach((color) => {
    if (!takenColors.includes(color)) {
      availableColors.push(color);
    }
  });

  return availableColors as Colors[];
};

export const getAvailableRandomColor = () => {
  const colors = getAvailableColors();
  return colors[Math.floor(Math.random() * colors.length)] as Colors;
};

export const isColorTaken = (color: Colors) => {
  const { players } = store.getState().game;

  const existColor = players.find((_player) => _player.color === color);

  return !!existColor;
};

export const convertRemToPixels = (rem: number) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const authLoader = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return response;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};
