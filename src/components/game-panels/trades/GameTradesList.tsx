import { useAppSelector } from "@/app/hooks";
import GameTradesItem from "./GameTradesItem";

const GameTradesList = () => {
  const { trades } = useAppSelector((state) => state.game);

  return trades.length > 0 ? (
    <ul className="divide-y-2">
      {[...trades]
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .map((trade) => (
          <GameTradesItem key={trade.id} trade={trade} />
        ))}
    </ul>
  ) : null;
  // <div className="text-center text-muted-foreground text-sm">
  //   {/* Game trades will appear here */}
  // </div>
};

export default GameTradesList;
