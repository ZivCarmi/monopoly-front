import { useAppSelector } from "@/app/hooks";
import TradeRowButton from "./TradeRowButton";

const GameTrades = () => {
  const { trades } = useAppSelector((state) => state.game);

  return trades.length > 0 ? (
    <ul>
      {[...trades]
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .map((trade) => (
          <TradeRowButton key={trade.id} trade={trade} />
        ))}
    </ul>
  ) : (
    <div className="text-center text-muted-foreground text-sm">
      {/* Game trades will appear here */}
    </div>
  );
};

export default GameTrades;
