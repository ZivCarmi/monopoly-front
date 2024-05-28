import { useAppSelector } from "@/app/hooks";
import { getPlayerColor, getPlayerName } from "@/utils";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import PlayerNamePlate from "../player/PlayerNamePlate";
import MoneySlider from "./MoneySlider";
import TradeBoard from "./TradeBoard";

const TradeOffers = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const { trade } = useAppSelector((state) => state.trade);
  const selfTrader = trade?.traders.find(
    (trader) => trader.id === selfPlayer?.id
  );
  const secondTrader = trade?.traders.find(
    (trader) => trader.id !== selfPlayer?.id
  );

  if (!selfTrader || !secondTrader) {
    return null;
  }

  const sortedTraders = [selfTrader, secondTrader];

  return (
    <div className="grid grid-cols-2 gap-10 justify-items-center">
      {sortedTraders.map((trader) => (
        <div className="flex flex-col" key={trader.id}>
          <PlayerNamePlate className="mb-2">
            <PlayerCharacter color={getPlayerColor(trader.id)!} />
            <PlayerName name={getPlayerName(trader.id)} />
            {selfPlayer?.id === trader.id && "(את/ה)"}
          </PlayerNamePlate>
          <TradeBoard trader={trader} />
          <MoneySlider trader={trader} />
        </div>
      ))}
    </div>
  );
};

export default TradeOffers;
