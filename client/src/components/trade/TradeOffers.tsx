import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectOffereePlayer,
  selectOfferorPlayer,
  setPlayerMoney,
} from "@/slices/trade-slice";
import { Slider } from "../ui/slider";
import TradeBoard from "./TradeBoard";

const TradeOffers = () => {
  const dispatch = useAppDispatch();
  const { offeror, offeree, status } = useAppSelector((state) => state.trade);
  const offerorPlayerObj = useAppSelector(selectOfferorPlayer);
  const offereePlayerObj = useAppSelector(selectOffereePlayer);

  if (!offeror || !offeree || !offerorPlayerObj || !offereePlayerObj)
    return null;

  const tradedPlayers = [
    {
      ...offeror,
      maxMoney: offerorPlayerObj.money,
    },
    {
      ...offeree,
      maxMoney: offereePlayerObj.money,
    },
  ];

  const setMoneyHandler = (playerId: string, amount: number) => {
    dispatch(
      setPlayerMoney({
        playerId,
        amount,
      })
    );
  };

  return (
    <div className="grid grid-cols-2 gap-10 justify-items-center">
      {tradedPlayers.map((player) => (
        <div className="space-y-8" key={player.id}>
          <TradeBoard playerId={player.id} />
          {player.maxMoney > 0 && (
            <div>
              <Slider
                className="data-[disabled]:opacity-50"
                max={player.maxMoney}
                step={1}
                disabled={status === "recieved" || status === "sent"}
                value={[player.money]}
                onValueChange={(amounts) =>
                  setMoneyHandler(player.id, amounts[0])
                }
              />
              <div className="mt-1 text-center">${player.money}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TradeOffers;
