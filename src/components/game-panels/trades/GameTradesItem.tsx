import { useAppDispatch, useAppSelector } from "@/app/hooks";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import PlayerName from "@/components/player/PlayerName";
import PlayerNamePlate from "@/components/player/PlayerNamePlate";
import { watchTrade } from "@/slices/trade-slice";
import { cn, getPlayerColor, getPlayerName } from "@/utils";
import { TradeType } from "@ziv-carmi/monopoly-utils";
import { ArrowRightLeft } from "lucide-react";
import { Fragment } from "react";

const GameTradesItem = ({ trade }: { trade: TradeType }) => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const isSelfTurn = selfPlayer?.id === trade.turn;

  return (
    <li className="group">
      <button
        className={cn(
          "flex w-full py-2 px-4 relative peer",
          isSelfTurn &&
            "before:bg-violet-400/15 before:absolute before:inset-0 before:animate-pulse group-last:before:rounded-bl-md group-last:before:rounded-br-md"
        )}
        onClick={() => dispatch(watchTrade(trade))}
      >
        <div className="isolate inline-flex gap-2 items-center text-foreground text-sm">
          {trade.traders.map((trader, idx) => {
            const traderName = getPlayerName(trader.id);
            const traderColor = getPlayerColor(trader.id);

            return (
              <Fragment key={trader.id}>
                <PlayerNamePlate>
                  {traderColor && (
                    <PlayerCharacter color={traderColor} size={0.85} />
                  )}
                  {traderName && <PlayerName name={traderName} />}
                </PlayerNamePlate>
                {idx === 0 && <ArrowRightLeft className="text-white w-5 h-5" />}
              </Fragment>
            );
          })}
        </div>
      </button>
    </li>
  );
};

export default GameTradesItem;
