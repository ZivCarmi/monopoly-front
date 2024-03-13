import { cn } from "@/utils";
import { useCallback, useEffect, useRef } from "react";
import BoardCenter from "../board-center/BoardCenter";
import CenterContent from "../board-center/CenterContent";
import Board from "../board/Board";
import GameBoardRows from "../board/GameBoardRows";
import WinnerScreen from "../winner/WinnerScreen";
import { useAppSelector } from "@/app/hooks";
import PlayersForm from "./PlayersForm";
import { isGameEnded, isGameNotStarted } from "@ziv-carmi/monopoly-utils";

interface MainBoardProps extends React.HTMLAttributes<HTMLDivElement> {}

const MainBoard = ({ className, ...props }: MainBoardProps) => {
  const { isReady, state } = useAppSelector((state) => state.game);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const boardDimensions = useRef([
    boardRef.current?.offsetWidth,
    boardRef.current?.offsetHeight,
  ]);

  const onResize = useCallback(() => {
    const grid = document.querySelector(".room-container");

    if (!boardContainerRef.current || !boardRef.current || !grid) return;

    const boardWidth = boardRef.current.offsetWidth;
    const boardHeight = boardRef.current.offsetHeight;

    if (
      boardDimensions.current[0] === undefined ||
      boardDimensions.current[1] === undefined
    ) {
      boardDimensions.current = [boardWidth, boardHeight];
    }

    const { paddingTop, paddingRight, paddingBottom, paddingLeft } =
      window.getComputedStyle(grid);
    const paddingX = parseFloat(paddingLeft) + parseFloat(paddingRight);
    const paddingY = parseFloat(paddingTop) + parseFloat(paddingBottom);
    const width = (window.innerWidth - paddingX) / boardWidth;
    const height = (window.innerHeight - paddingY) / boardHeight;
    const scaleValue = Math.min(width, height);
    const shouldScale = Math.max(scaleValue, 0.3) <= 1;

    if (
      shouldScale &&
      boardDimensions.current[0] &&
      boardDimensions.current[1]
    ) {
      boardContainerRef.current.style.transform = `scale(${scaleValue})`;
      boardContainerRef.current.style.width =
        boardDimensions.current[0] * scaleValue + "px";
      boardContainerRef.current.style.height =
        boardDimensions.current[1] * scaleValue + "px";
    }
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      {...props}
      className={cn("relative origin-top-left rtl:origin-top-right", className)}
      ref={boardContainerRef}
    >
      <div className="w-fit relative m-auto">
        {isGameNotStarted(state) && !isReady && <PlayersForm />}
        {isGameEnded(state) && <WinnerScreen />}
        <Board className="h-fit" ref={boardRef}>
          <BoardCenter className="w-[47rem] h-[47rem]">
            <CenterContent />
          </BoardCenter>
          <GameBoardRows />
        </Board>
      </div>
    </div>
  );
};

export default MainBoard;
