import { useEffect, useRef } from "react";
import BoardCenter from "../board-center/BoardCenter";
import CenterContent from "../board-center/CenterContent";
import Board from "./Board";
import GameBoardRows from "./GameBoardRows";

// CURRENTLY UNUSED

type GameBoardProps = {
  setBoardDimensions?: React.Dispatch<React.SetStateAction<number[]>>;
};

const GameBoard = ({ setBoardDimensions }: GameBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  const onResize = () => {
    if (typeof setBoardDimensions === "function") {
      if (boardRef.current) {
        console.log(boardRef.current.offsetWidth);

        setBoardDimensions([
          boardRef.current.offsetWidth,
          boardRef.current.offsetHeight,
        ]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Board className="h-fit" ref={boardRef}>
      <BoardCenter className="min-w-[45rem] min-h-[45rem]">
        <CenterContent />
      </BoardCenter>
      <GameBoardRows />
    </Board>
  );
};

export default GameBoard;
