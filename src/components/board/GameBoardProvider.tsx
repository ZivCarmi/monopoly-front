import { useAppSelector } from "@/app/hooks";
import { BoardRaw } from "@/types/Board";
import { createBoard } from "@/utils";
import { createContext, useContext, useEffect, useState } from "react";
import Loader from "../ui/loader";

const GameBoardContext = createContext<BoardRaw>([]);

export function useGameBoard() {
  const gameBoard = useContext(GameBoardContext);

  if (!gameBoard) {
    throw new Error("useGameBoard must be used within a GameBoardProvider");
  }

  return gameBoard;
}

export function GameBoardProvider({ children }: { children: React.ReactNode }) {
  const {
    map: { board },
  } = useAppSelector((state) => state.game);
  const [gameBoard, setGameBoard] = useState<BoardRaw>([]);

  useEffect(() => {
    setGameBoard(createBoard());

    return () => {
      setGameBoard([]);
    };
  }, [board]);

  return (
    <GameBoardContext.Provider value={gameBoard}>
      {gameBoard.length ? (
        children
      ) : (
        <div className="fixed inset-1/2">
          <Loader />
        </div>
      )}
    </GameBoardContext.Provider>
  );
}

export default GameBoardProvider;
