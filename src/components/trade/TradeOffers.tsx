import { useAppSelector } from "@/app/hooks";
import { getPlayerColor, getPlayerName } from "@/utils";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import PlayerNamePlate from "../player/PlayerNamePlate";
import MoneySlider from "./MoneySlider";
import TradeBoard from "./TradeBoard";
import useWindowSize from "@/hooks/useWindowSize";
import TradeBoardList from "./TradeBoardList";

const TradeOffers = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const { trade } = useAppSelector((state) => state.trade);
  const firstTrader = trade?.traders.find(
    (trader) => trader.id === trade.createdBy
  );
  const secondTrader = trade?.traders.find(
    (trader) => trader.id !== trade.createdBy
  );
  const { width } = useWindowSize();
  const tradeAsList = width <= 700;

  if (!trade) {
    return null;
  }

  const sortedTraders = [firstTrader, secondTrader];

  return (
    <div className="grid grid-cols-2 gap-6">
      {sortedTraders.map(
        (trader) =>
          trader && (
            <div className="flex flex-col gap-2" key={trader.id}>
              <PlayerNamePlate>
                <PlayerCharacter color={getPlayerColor(trader.id)!} />
                <PlayerName
                  name={getPlayerName(trader.id)}
                  className="break-keep"
                >
                  {selfPlayer?.id === trader.id && " (אתה)"}
                </PlayerName>
              </PlayerNamePlate>
              {tradeAsList ? (
                <TradeBoardList trader={trader} />
              ) : (
                <TradeBoard trader={trader} />
              )}
              <MoneySlider trader={trader} />
            </div>
          )
      )}
    </div>
  );
};

export default TradeOffers;
