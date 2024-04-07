import { useAppSelector } from "@/app/hooks";
import Trade from "@/components/trade/Trade";
import GamePanel from "@/components/ui/game-panel";
import TradeRowButton from "./TradeRowButton";
import PanelTitle from "../PanelTitle";

const GameTrades = () => {
  const { trades } = useAppSelector((state) => state.game);

  return (
    <GamePanel>
      <PanelTitle>Trades</PanelTitle>
      {trades.length > 0 ? (
        <ul>
          {[...trades]
            .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
            .map((trade) => (
              <TradeRowButton key={trade.id} trade={trade} />
            ))}
        </ul>
      ) : (
        <div className="text-center text-muted-foreground text-sm">
          Game trades will appear here
        </div>
      )}
      <Trade />
    </GamePanel>
  );
};

export default GameTrades;
