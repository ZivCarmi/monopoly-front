import { useAppDispatch, useAppSelector } from "@/app/hooks";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import PlayerName from "@/components/player/PlayerName";
import PlayerNamePlate from "@/components/player/PlayerNamePlate";
import { Button } from "@/components/ui/button";
import { setMode, setTrade, setTradeIsOpen } from "@/slices/trade-slice";
import { getPlayerColor, getPlayerName } from "@/utils";
import { TradeType } from "@ziv-carmi/monopoly-utils";
import { ArrowRightLeft } from "lucide-react";
import { Fragment } from "react";

const TradeRowButton = ({ trade }: { trade: TradeType }) => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const isSelfTurn = selfPlayer?.id === trade.turn;

  const watchTradeHandler = () => {
    dispatch(setTradeIsOpen(true));
    dispatch(setTrade(trade));
    dispatch(setMode("watching"));
  };

  return (
    <li>
      <div>
        <Button
          className={`bg-transparent hover:bg-transparent gap-4 justify-start relative ${
            isSelfTurn &&
            "before:bg-purple-600 before:absolute before:inset-0 before:animate-pulse before:rounded-md"
          }`}
          onClick={watchTradeHandler}
        >
          <div className="isolate inline-flex gap-2 items-center">
            {trade.traders.map((trader, idx) => {
              const traderName = getPlayerName(trader.id);
              const traderColor = getPlayerColor(trader.id);

              return (
                <Fragment key={trader.id}>
                  <PlayerNamePlate>
                    {traderColor && <PlayerCharacter color={traderColor} />}
                    {traderName && <PlayerName name={traderName} />}
                  </PlayerNamePlate>
                  {idx === 0 && (
                    <ArrowRightLeft className="text-primary w-5 h-5" />
                  )}
                </Fragment>
              );
            })}
          </div>
        </Button>
      </div>
    </li>
  );
};

export default TradeRowButton;
