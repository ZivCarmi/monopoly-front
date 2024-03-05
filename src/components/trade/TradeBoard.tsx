import { useAppSelector } from "@/app/hooks";
import BoardCenter from "../board-center/BoardCenter";
import Board from "../board/Board";
import TradeBoardRows from "./TradeBoardRows";

type TradeBoardProps = {
  playerId: string;
};

const TradeBoard = ({ playerId }: TradeBoardProps) => {
  const { status } = useAppSelector((state) => state.trade);
  const isDisabled = status === "sent" || status === "recieved";

  return (
    <Board className={`tradeBoard ${isDisabled ? "opacity-50" : ""}`}>
      <BoardCenter className="min-w-[15rem] min-h-[15rem]" />
      <TradeBoardRows playerId={playerId} />
    </Board>
  );
};

export default TradeBoard;
