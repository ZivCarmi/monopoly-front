import Board, { IGo, IJail, TileTypes } from "./types/Board";
import ChanceCards, { ChanceCardTypes, PaymentTypes } from "./types/Cards";
import TileBuilder from "./classes/Board";
import { AIRPORT_TILE_COST, COMPANY_TILE_COST } from "./constants";
import { shuffleArray } from "./utils";

export const getGoTile = (board: Board) =>
  board.find((tile) => tile.type === TileTypes.GO) as IGo;

export const getJailTile = (board: Board) =>
  board.find((tile) => tile.type === TileTypes.JAIL) as IJail | undefined;

export const getJailTileIndex = (board: Board) =>
  board.findIndex((tile) => tile.type === TileTypes.JAIL);

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
      name: "אלכסנדרייה",
      cost: 60,
      color: "violet",
      rent: [2, 4, 10, 30, 90, 160, 250],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      name: "קהיר",
      cost: 60,
      color: "violet",
      rent: [4, 8, 20, 60, 180, 320, 450],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      name: "ירושלים",
      cost: 100,
      color: "lightblue",
      rent: [6, 12, 30, 90, 270, 400, 550],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      name: "חיפה",
      cost: 100,
      color: "lightblue",
      rent: [6, 12, 30, 90, 270, 400, 550],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      name: "תל-אביב",
      cost: 120,
      color: "lightblue",
      rent: [8, 16, 40, 100, 300, 450, 600],
      houseCost: 50,
      hotelCost: 50,
    }),
    new TileBuilder.PropertyTile({
      name: "מלבורן",
      cost: 140,
      color: "purple",
      rent: [10, 20, 50, 150, 450, 625, 750],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      name: "סידני",
      cost: 140,
      color: "purple",
      rent: [10, 20, 50, 150, 450, 625, 750],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      name: "פרת'",
      cost: 160,
      color: "purple",
      rent: [12, 24, 60, 180, 500, 700, 900],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      name: "קאזאן",
      cost: 180,
      color: "orange",
      rent: [14, 28, 70, 200, 550, 750, 950],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      name: "רוסטוב",
      cost: 180,
      color: "orange",
      rent: [14, 28, 70, 200, 550, 750, 950],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      name: "מוסקבה",
      cost: 200,
      color: "orange",
      rent: [16, 32, 80, 220, 600, 800, 1000],
      houseCost: 100,
      hotelCost: 100,
    }),
    new TileBuilder.PropertyTile({
      name: "גואנזו",
      cost: 220,
      color: "red",
      rent: [18, 36, 90, 250, 700, 875, 1050],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      name: "שנגחאי",
      cost: 220,
      color: "red",
      rent: [18, 36, 90, 250, 700, 875, 1050],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      name: "בייג'ין",
      cost: 240,
      color: "red",
      rent: [20, 40, 100, 300, 750, 925, 1100],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      name: "מילאנו",
      cost: 260,
      color: "yellow",
      rent: [22, 44, 110, 330, 800, 975, 1150],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      name: "נאפולי",
      cost: 260,
      color: "yellow",
      rent: [22, 44, 110, 330, 800, 975, 1150],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      name: "רומא",
      cost: 280,
      color: "yellow",
      rent: [24, 48, 120, 360, 850, 1025, 1200],
      houseCost: 150,
      hotelCost: 150,
    }),
    new TileBuilder.PropertyTile({
      name: "ליברפול",
      cost: 300,
      color: "green",
      rent: [26, 52, 130, 390, 900, 1100, 1275],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      name: "מנצ'סטר",
      cost: 300,
      color: "green",
      rent: [26, 52, 130, 390, 900, 1100, 1275],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      name: "לונדון",
      cost: 320,
      color: "green",
      rent: [28, 56, 150, 450, 1000, 1200, 1400],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      name: "וושינגטון",
      cost: 350,
      color: "blue",
      rent: [35, 70, 175, 500, 1100, 1300, 1500],
      houseCost: 200,
      hotelCost: 200,
    }),
    new TileBuilder.PropertyTile({
      name: "ניו-יורק",
      cost: 400,
      color: "blue",
      rent: [50, 100, 200, 600, 1400, 1700, 2000],
      houseCost: 200,
      hotelCost: 200,
    }),
  ];

  const airport1 = new TileBuilder.IndustryTile({
    type: TileTypes.AIRPORT,
    name: "שדה תעופה בן-גוריון",
    cost: AIRPORT_TILE_COST,
  });
  const airport2 = new TileBuilder.IndustryTile({
    type: TileTypes.AIRPORT,
    name: "שדה תעופה סידני",
    cost: AIRPORT_TILE_COST,
  });
  const airport3 = new TileBuilder.IndustryTile({
    type: TileTypes.AIRPORT,
    name: "שדה תעופה בייג'ין",
    cost: AIRPORT_TILE_COST,
  });
  const airport4 = new TileBuilder.IndustryTile({
    type: TileTypes.AIRPORT,
    name: "שדה תעופה קנדי",
    cost: AIRPORT_TILE_COST,
  });
  const company1 = new TileBuilder.IndustryTile({
    type: TileTypes.COMPANY,
    name: "חברת החשמל",
    cost: COMPANY_TILE_COST,
  });
  const company2 = new TileBuilder.IndustryTile({
    type: TileTypes.AIRPORT,
    name: "חברת המים",
    cost: COMPANY_TILE_COST,
  });
  const company3 = new TileBuilder.IndustryTile({
    type: TileTypes.AIRPORT,
    name: "חברת הטלפון",
    cost: COMPANY_TILE_COST,
  });

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
    airport1,
    cities[2],
    new TileBuilder.Tile({
      type: TileTypes.SURPRISE,
      name: "הפתעה",
    }),
    cities[3],
    cities[4],
    cornerTiles.jail,
    cities[5],
    company1,
    cities[6],
    cities[7],
    airport2,
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
    airport3,
    cities[14],
    cities[15],
    company2,
    cities[16],
    cornerTiles.goToJail,
    cities[17],
    cities[18],
    new TileBuilder.Tile({
      type: TileTypes.CHANCE,
      name: "צ'אנסה",
    }),
    cities[19],
    airport4,
    new TileBuilder.Tile({
      type: TileTypes.SURPRISE,
      name: "הפתעה",
    }),
    cities[20],
    company3,
    cities[21],
  ];

  const chanceCards = [
    new ChanceCards.Payment({
      message: "מצאת ארנק עם כסף. הרווחת $200.",
      type: ChanceCardTypes.PAYMENT,
      event: {
        amount: 200,
        paymentType: PaymentTypes.EARN,
      },
    }),
    new ChanceCards.Payment({
      message: "חנוכה הגיע וסבתא החליטה לפנק אותך ב $30.",
      type: ChanceCardTypes.PAYMENT,
      event: {
        amount: 30,
        paymentType: PaymentTypes.EARN,
      },
    }),
    new ChanceCards.Payment({
      message: "הטלפון שלך הלך קפוט. שלם $200 לתיקון.",
      type: ChanceCardTypes.PAYMENT,
      event: {
        amount: 200,
        paymentType: PaymentTypes.PAY,
      },
    }),
    new ChanceCards.Payment({
      message: "הרמת חפלה בבית. גבה מכל משתמש $50.",
      type: ChanceCardTypes.GROUP_PAYMENT,
      event: {
        amount: 50,
        paymentType: PaymentTypes.EARN,
      },
    }),
    new ChanceCards.Payment({
      message: "הפסדת בהתערבות עם החבר'ה. שלם לכל אחד $50.",
      type: ChanceCardTypes.GROUP_PAYMENT,
      event: {
        amount: 50,
        paymentType: PaymentTypes.PAY,
      },
    }),
    new ChanceCards.AdvancedToTile({
      message: `התקדם ל${board[0].name}`,
      event: {
        tileIndex: 0,
        shouldGetGoReward: true,
      },
    }),
    new ChanceCards.AdvancedToTile({
      message: `התקדם ל${board[11].name}`,
      event: {
        tileIndex: 11,
        shouldGetGoReward: true,
      },
    }),
    new ChanceCards.AdvancedToTileType({
      message: "התקדם לשדה התעופה הקרוב",
      event: {
        tileType: TileTypes.AIRPORT,
      },
    }),
    new ChanceCards.AdvancedToTileType({
      message: "התקדם לחברה הקרובה",
      event: {
        tileType: TileTypes.COMPANY,
      },
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
