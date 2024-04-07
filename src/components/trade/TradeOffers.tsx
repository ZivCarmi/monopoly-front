import { getPlayerCharacter, getPlayerColor, getPlayerName } from "@/utils";
import { TradeType } from "@ziv-carmi/monopoly-utils";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import PlayerNamePlate from "../player/PlayerNamePlate";
import MoneySlider from "./MoneySlider";
import TradeBoard from "./TradeBoard";
import { useAppSelector } from "@/app/hooks";

const TradeOffers = ({ trade }: { trade: TradeType }) => {
  const { selfPlayer } = useAppSelector((state) => state.game);

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
