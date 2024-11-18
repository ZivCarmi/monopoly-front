import { useAppSelector } from "@/app/hooks";
import { TradePlayer } from "@ziv-carmi/monopoly-utils";
import Board from "../board/Board";
import TradeBoardCenter from "./TradeBoardCenter";
import TradeBoardRows from "./TradeBoardRows";
import { cn } from "@/utils";

const TradeBoard = ({ trader }: { trader: TradePlayer }) => {
  const { mode } = useAppSelector((state) => state.trade);
  const isDisabled = mode !== "creating" && mode !== "editing";

  return (
    <Board className={cn("tradeBoard")}>
      <TradeBoardCenter trader={trader} isDisabled={isDisabled} />
      <TradeBoardRows trader={trader} isDisabled={isDisabled} />
    </Board>
  );
};

export default TradeBoard;
