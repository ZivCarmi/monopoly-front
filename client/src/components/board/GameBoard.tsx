import BoardCenter from "../board-center/BoardCenter";
import CenterContent from "../board-center/CenterContent";
import Board from "./Board";
import GameBoardRows from "./GameBoardRows";

const GameBoard = () => {
  return (
    <Board className="h-0">
      <BoardCenter className="min-w-[45rem] min-h-[45rem]">
        <CenterContent />
      </BoardCenter>
      <GameBoardRows />
    </Board>
  );
};

export default GameBoard;
