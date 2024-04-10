import { useAppSelector } from "@/app/hooks";
import { getPlayerCharacter, getPlayerColor, getPlayerName } from "@/utils";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import PlayerNamePlate from "../player/PlayerNamePlate";
import MoneySlider from "./MoneySlider";
import TradeBoard from "./TradeBoard";

const TradeOffers = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const { trade } = useAppSelector((state) => state.trade);

  if (!trade) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-10 justify-items-center">
      {trade.traders.map((trader) => (
        <div key={trader.id}>
          <PlayerNamePlate className="mb-2">
            <PlayerCharacter character={getPlayerCharacter(trader.id)!} />
            <PlayerName
              name={getPlayerName(trader.id)}
              color={getPlayerColor(trader.id)!}
            />
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
