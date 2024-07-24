import { useAppSelector } from "@/app/hooks";
import { BoardRaw } from "@/types/Board";
import { createBoard, isSelfPlayerParticipating } from "@/utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Loader from "../ui/loader";
import {
  unstable_BlockerFunction as BlockerFunction,
  unstable_Blocker as Blocker,
  useBlocker,
} from "react-router-dom";
import ConfirmNavigationMidGame from "./ConfirmNavigationMidGame";

type ContextValues = {
  gameBoard: BoardRaw;
  blocker?: Blocker;
  setIsVotekicked?: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameRoomContext = createContext<ContextValues>({
  gameBoard: [],
});

export const useGameRoom = () => {
  const gameRoom = useContext(GameRoomContext);

  if (!gameRoom) {
    throw new Error("useGameRoom must be used within a GameRoomProvider");
  }

  return gameRoom;
};

const GameRoomProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    map: { board },
  } = useAppSelector((state) => state.game);
  const [gameBoard, setGameBoard] = useState<BoardRaw>([]);
  const [isVotekicked, setIsVotekicked] = useState(false);
  const isSelfParticipating = isSelfPlayerParticipating();
  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      !isVotekicked &&
      isSelfParticipating &&
      currentLocation.pathname !== nextLocation.pathname,
    [isVotekicked, isSelfParticipating]
  );
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    setGameBoard(createBoard());

    return () => {
      setGameBoard([]);
    };
  }, [board]);

  const values: ContextValues = {
    gameBoard,
    blocker,
    setIsVotekicked,
  };

  return (
    <GameRoomContext.Provider value={values}>
      {gameBoard.length ? (
        <>
          {children}
          {blocker ? <ConfirmNavigationMidGame blocker={blocker} /> : null}
        </>
      ) : (
        <div className="fixed inset-1/2">
          <Loader />
        </div>
      )}
    </GameRoomContext.Provider>
  );
};

export default GameRoomProvider;
