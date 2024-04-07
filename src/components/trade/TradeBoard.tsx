import { useAppSelector } from "@/app/hooks";
import { TradePlayer } from "@ziv-carmi/monopoly-utils";
import BoardCenter from "../board-center/BoardCenter";
import Board from "../board/Board";
import TradeBoardRows from "./TradeBoardRows";

const TradeBoard = ({ trader }: { trader: TradePlayer }) => {
  const { mode } = useAppSelector((state) => state.trade);
  const isDisabled = mode !== "creating" && mode !== "editing";

  return (
    <Board className={`tradeBoard ${isDisabled ? "opacity-50" : ""}`}>
      <BoardCenter className="min-w-[15rem] min-h-[15rem]" />
      <TradeBoardRows trader={trader} />
    </Board>
  );
};

export default TradeBoard;
