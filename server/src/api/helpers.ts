import Board, {
  CountryIds,
  IGo,
  IProperty,
  RentIndexes,
  TileTypes,
} from "./types/Board";
import ChanceCards, {
  AdvancedToTileCard,
  AdvancedToTileTypeCard,
  ChanceCardTypes,
  PaymentCard,
  PaymentTypes,
} from "./types/Cards";
import TileBuilder from "./classes/Board";
import {
  AIRPORT_NAMES,
  AIRPORT_TILE_COST,
  COMPANY_NAMES,
  COMPANY_TILE_COST,
  COUNTRIES,
} from "./constants";
import { shuffleArray } from "./utils";
import Room from "./types/Room";

export const getGoTile = (board: Board) =>
  board.find((tile) => tile.type === TileTypes.GO) as IGo;

export const getJailTileIndex = (board: Board) =>
  board.findIndex((tile) => tile.type === TileTypes.JAIL);

export const getCities = (board: Board, countryId: CountryIds) =>
  board.filter(
    (tile) => tile.type === TileTypes.PROPERTY && tile.country.id === countryId
  ) as IProperty[];

export const hasBuildings = (board: Board, countryId: CountryIds) => {
  return getCities(board, countryId).some(
    (city) => city.rentIndex !== RentIndexes.BLANK
  );
};

export const hasMonopoly = (board: Board, countryId: CountryIds) => {
  const cities = getCities(board, countryId);

  return cities.every((city) => city.owner === cities[0].owner);
};

export const initializeMap = () => {
  const cornerTiles = {
    go: new TileBuilder.Tile({
      type: TileTypes.GO,
      name: "דרך צלחה",
    }),
    jail: new TileBuilder.SuspensionTile({
      type: TileTypes.JAIL,
      name: "כלא",
      suspensionAmount: 3,
    }),
    vacation: new TileBuilder.SuspensionTile({
      type: TileTypes.VACATION,
      name: "חופשה",
      suspensionAmount: 1,
    }),
    goToJail: new TileBuilder.Tile({
      type: TileTypes.GO_TO_JAIL,
      name: "הכנס לכלא",
    }),
  };

  const cities = [
    new TileBuilder.PropertyTile({
      country: COUNTRIES.egypt,
      name: "אלכסנדרייה",
      cost: 60,
      color: "violet",
      rent: [2, 10, 30, 90, 160, 250],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.egypt,
      name: "קהיר",
      cost: 60,
      color: "violet",
      rent: [4, 20, 60, 180, 320, 450],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.israel,
      name: "ירושלים",
      cost: 100,
      color: "lightblue",
      rent: [6, 30, 90, 270, 400, 550],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.israel,
      name: "חיפה",
      cost: 100,
      color: "lightblue",
      rent: [6, 30, 90, 270, 400, 550],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.israel,
      name: "תל-אביב",
      cost: 120,
      color: "lightblue",
      rent: [8, 40, 100, 300, 450, 600],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.australia,
      name: "מלבורן",
      cost: 140,
      color: "purple",
      rent: [10, 50, 150, 450, 625, 750],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.australia,
      name: "סידני",
      cost: 140,
      color: "purple",
      rent: [10, 50, 150, 450, 625, 750],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.australia,
      name: "פרת'",
      cost: 160,
      color: "purple",
      rent: [12, 60, 180, 500, 700, 900],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.russia,
      name: "קאזאן",
      cost: 180,
      color: "orange",
      rent: [14, 70, 200, 550, 750, 950],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.russia,
      name: "רוסטוב",
      cost: 180,
      color: "orange",
      rent: [14, 70, 200, 550, 750, 950],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.russia,
      name: "מוסקבה",
      cost: 200,
      color: "orange",
      rent: [16, 80, 220, 600, 800, 1000],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.china,
      name: "גואנזו",
      cost: 220,
      color: "red",
      rent: [18, 90, 250, 700, 875, 1050],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.china,
      name: "שנגחאי",
      cost: 220,
      color: "red",
      rent: [18, 90, 250, 700, 875, 1050],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.china,
      name: "בייג'ין",
      cost: 240,
      color: "red",
      rent: [20, 100, 300, 750, 925, 1100],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.italy,
      name: "מילאנו",
      cost: 260,
      color: "yellow",
      rent: [22, 110, 330, 800, 975, 1150],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.italy,
      name: "נאפולי",
      cost: 260,
      color: "yellow",
      rent: [22, 110, 330, 800, 975, 1150],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.italy,
      name: "רומא",
      cost: 280,
      color: "yellow",
      rent: [24, 120, 360, 850, 1025, 1200],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.uk,
      name: "ליברפול",
      cost: 300,
      color: "green",
      rent: [26, 130, 390, 900, 1100, 1275],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.uk,
      name: "מנצ'סטר",
      cost: 300,
      color: "green",
      rent: [26, 130, 390, 900, 1100, 1275],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.uk,
      name: "לונדון",
      cost: 320,
      color: "green",
      rent: [28, 150, 450, 1000, 1200, 1400],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.usa,
      name: "וושינגטון",
      cost: 350,
      color: "blue",
      rent: [35, 175, 500, 1100, 1300, 1500],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      country: COUNTRIES.usa,
      name: "ניו-יורק",
      cost: 400,
      color: "blue",
      rent: [50, 200, 600, 1400, 1700, 2000],
      houseCost: 200,
      hotelCost: 200,
    }),
  ];

  const airports = AIRPORT_NAMES.map(
    (airportName) =>
      new TileBuilder.IndustryTile({
        type: TileTypes.AIRPORT,
        name: airportName,
        cost: AIRPORT_TILE_COST,
      })
  );

  const companies = COMPANY_NAMES.map(
    (companyName) =>
      new TileBuilder.IndustryTile({
        type: TileTypes.COMPANY,
        name: companyName,
        cost: COMPANY_TILE_COST,
      })
  );

  const board: Board = [
    cornerTiles.go,
    cities[0],
    new TileBuilder.Tile({
      type: TileTypes.CHANCE,
      name: "צ'אנסה",
    }),
    cities[1],
    new TileBuilder.TaxTile({
      name: "מס הכנסה",
      taxRate: 10,
    }),
    airports[0],
    cities[2],
    new TileBuilder.Tile({
      type: TileTypes.SURPRISE,
      name: "הפתעה",
    }),
    cities[3],
    cities[4],
    cornerTiles.jail,
    cities[5],
    companies[0],
    cities[6],
    cities[7],
    airports[1],
    cities[8],
    new TileBuilder.Tile({
      type: TileTypes.CHANCE,
      name: "צ'אנסה",
    }),
    cities[9],
    cities[10],
    cornerTiles.vacation,
    cities[11],
    new TileBuilder.Tile({
      type: TileTypes.SURPRISE,
      name: "הפתעה",
    }),
    cities[12],
    cities[13],
    airports[2],
    cities[14],
    cities[15],
    companies[1],
    cities[16],
    cornerTiles.goToJail,
    cities[17],
    cities[18],
    new TileBuilder.Tile({
      type: TileTypes.CHANCE,
      name: "צ'אנסה",
    }),
    cities[19],
    airports[3],
    new TileBuilder.Tile({
      type: TileTypes.SURPRISE,
      name: "הפתעה",
    }),
    cities[20],
    companies[2],
    cities[21],
  ];

  const chanceCards = [
    new ChanceCards.PaymentCard({
      message: "מצאת ארנק עם כסף. הרווחת $200.",
      type: ChanceCardTypes.PAYMENT,
      event: {
        amount: 200,
        paymentType: PaymentTypes.EARN,
      },
    }),
    new ChanceCards.PaymentCard({
      message: "חנוכה הגיע וסבתא החליטה לפנק אותך ב $30.",
      type: ChanceCardTypes.PAYMENT,
      event: {
        amount: 30,
        paymentType: PaymentTypes.EARN,
      },
    }),
    new ChanceCards.PaymentCard({
      message: "הטלפון שלך הלך קפוט. שלם $200 לתיקון.",
      type: ChanceCardTypes.PAYMENT,
      event: {
        amount: 200,
        paymentType: PaymentTypes.PAY,
      },
    }),
    new ChanceCards.PaymentCard({
      message: "נתקעת עם הרכב. שלם $50 לגרר.",
      type: ChanceCardTypes.PAYMENT,
      event: {
        amount: 50,
        paymentType: PaymentTypes.PAY,
      },
    }),
    new ChanceCards.PaymentCard({
      message: "הרמת חפלה בבית. גבה מכל משתמש $50.",
      type: ChanceCardTypes.GROUP_PAYMENT,
      event: {
        amount: 50,
        paymentType: PaymentTypes.EARN,
      },
    }),
    new ChanceCards.PaymentCard({
      message: "הפסדת בהתערבות עם החבר'ה. שלם לכל אחד $50.",
      type: ChanceCardTypes.GROUP_PAYMENT,
      event: {
        amount: 50,
        paymentType: PaymentTypes.PAY,
      },
    }),
    new ChanceCards.AdvancedToTileCard({
      message: `התקדם ל${board[0].name}`,
      event: {
        tileIndex: 0,
        shouldGetGoReward: true,
      },
    }),
    new ChanceCards.AdvancedToTileCard({
      message: `התקדם ל${board[11].name}`,
      event: {
        tileIndex: 11,
        shouldGetGoReward: true,
      },
    }),
    new ChanceCards.AdvancedToTileCard({
      message: `התקדם ל${board[3].name}`,
      event: {
        tileIndex: 3,
        shouldGetGoReward: true,
      },
    }),
    new ChanceCards.AdvancedToTileTypeCard({
      message: "התקדם לשדה התעופה הקרוב",
      event: {
        tileType: TileTypes.AIRPORT,
      },
    }),
    new ChanceCards.AdvancedToTileTypeCard({
      message: "התקדם לחברה הקרובה",
      event: {
        tileType: TileTypes.COMPANY,
      },
    }),
    new ChanceCards.WalkCard({
      message: "חזור 3 צעדים",
      event: {
        steps: -3,
      },
    }),
    new ChanceCards.WalkCard({
      message: "התקדם 3 צעדים",
      event: {
        steps: 3,
      },
    }),
    new ChanceCards.GoToJail({
      message: "הכנס לכלא!",
    }),
  ];

  shuffleArray(chanceCards);

  return {
    board,
    goRewards: {
      land: 300,
      pass: 200,
    },
    chances: {
      cards: chanceCards,
      currentIndex: 0,
    },
  };
};

export const paymentChanceCard = (
  playerId: string,
  card: PaymentCard,
  room: Room
) => {
  const { players } = room;
  const { event, type } = card;
  let updatedPlayers = players;

  switch (type) {
    case ChanceCardTypes.PAYMENT:
      switch (event.paymentType) {
        case PaymentTypes.PAY:
          updatedPlayers[playerId].money -= event.amount;
          return updatedPlayers;
        case PaymentTypes.EARN:
          updatedPlayers[playerId].money += event.amount;
          return updatedPlayers;
      }
    case ChanceCardTypes.GROUP_PAYMENT:
      switch (event.paymentType) {
        case PaymentTypes.PAY:
          for (const player in players) {
            if (players[player].id === playerId) continue;

            updatedPlayers[playerId].money -= event.amount;
            updatedPlayers[player].money += event.amount;
          }

          return updatedPlayers;
        case PaymentTypes.EARN:
          for (const player in players) {
            if (players[player].id === playerId) continue;

            updatedPlayers[playerId].money += event.amount;
            updatedPlayers[player].money -= event.amount;
          }

          return updatedPlayers;
      }
    default:
      return updatedPlayers;
  }
};

export const advanceToTileChanceCard = (
  playerId: string,
  card: AdvancedToTileCard,
  room: Room
) => {
  const {
    players,
    map: { goRewards },
  } = room;
  const { event } = card;
  const player = players[playerId];

  if (event.shouldGetGoReward) {
    const shouldGetLandReward = event.tileIndex === 0;
    const shouldGetPassReward = player.tilePos > event.tileIndex;
    let rewardAmount: number = 0;

    if (shouldGetLandReward) {
      rewardAmount = goRewards.land;
    } else if (shouldGetPassReward) {
      rewardAmount = goRewards.pass;
    }

    if (rewardAmount) {
      player.money += rewardAmount;
    }
  }

  player.tilePos = event.tileIndex;

  return player;
};

export const advanceToTileTypeChanceCard = (
  playerId: string,
  card: AdvancedToTileTypeCard,
  room: Room
) => {
  const {
    players,
    map: { board },
  } = room;
  const { event } = card;
  const player = players[playerId];
  let closestTileTypeIndex: number | null = null;

  // get closest tile that match the event type
  for (let [tileIndex, tile] of board.entries()) {
    if (tile.type === event.tileType && player.tilePos < tileIndex) {
      closestTileTypeIndex = tileIndex;
      break;
    } else if (tileIndex === board.length - 1) {
      closestTileTypeIndex = board.findIndex(
        (_tile) => _tile.type === event.tileType
      );
      break;
    }
  }

  if (closestTileTypeIndex !== null) {
    player.tilePos = closestTileTypeIndex;
  }

  return player;
};
