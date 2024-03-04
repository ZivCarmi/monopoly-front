import { useAppSelector } from "@/app/hooks";
import { selectOffereePlayer, selectOfferorPlayer } from "@/slices/trade-slice";
import { getPlayerCharacter, getPlayerColor, getPlayerName } from "@/utils";
import { InTradePlayer } from "@ziv-carmi/monopoly-utils";
import PlayerNamePlate from "../player/PlayerNamePlate";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import MoneySlider from "./MoneySlider";
import TradeBoard from "./TradeBoard";

const TradeOffers = () => {
  const { offeror, offeree } = useAppSelector((state) => state.trade);
  const offerorPlayerObj = useAppSelector(selectOfferorPlayer);
  const offereePlayerObj = useAppSelector(selectOffereePlayer);

  if (!offeror || !offeree || !offerorPlayerObj || !offereePlayerObj) {
    return null;
  }

  const tradedPlayers: InTradePlayer[] = [
    {
      ...offeror,
      maxMoney: offerorPlayerObj.money,
    },
    {
      ...offeree,
      maxMoney: offereePlayerObj.money,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-10 justify-items-center">
      {tradedPlayers.map((player) => (
        <div key={player.id}>
          <PlayerNamePlate className="mb-2">
            <PlayerCharacter character={getPlayerCharacter(player.id)!} />
            <PlayerName
              name={getPlayerName(player.id)}
              color={getPlayerColor(player.id)!}
            />
          </PlayerNamePlate>
          <TradeBoard playerId={player.id} />
          {player.maxMoney > 0 && <MoneySlider player={player} />}
        </div>
      ))}
    </div>
  );
};

export default TradeOffers;
