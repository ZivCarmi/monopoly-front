import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import GameBoardProvider from "@/components/board/GameBoardProvider";
import ConfirmNavigationMidGame from "@/components/game-room/ConfirmNavigationMidGame";
import GameRoom from "@/components/game-room/GameRoom";
import useJoinRoom from "@/hooks/useJoinRoom";
import { isGameStarted } from "@ziv-carmi/monopoly-utils";
import { useCallback, useEffect, useRef } from "react";
import type { unstable_BlockerFunction as BlockerFunction } from "react-router-dom";
import { useBlocker, useParams } from "react-router-dom";

const GameRoomPage = () => {
  const { roomId } = useParams();
  const { state, selfPlayer, isInRoom } = useAppSelector((state) => state.game);
  const isFirstRender = useRef(true);
  const socket = useSocket();
  const joinRoom = useJoinRoom();
  const isPlayingInRunningGame = isGameStarted(state) && !!selfPlayer;
  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      isPlayingInRunningGame &&
      currentLocation.pathname !== nextLocation.pathname,
    [isPlayingInRunningGame]
  );
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (roomId && !isInRoom && isFirstRender.current) {
      joinRoom({ roomId });
      isFirstRender.current = false;
    }

    const updateGameOnFocus = () => {
      socket.emit("update_game");
    };

    window.addEventListener("visibilitychange", updateGameOnFocus);

    return () => {
      window.removeEventListener("visibilitychange", updateGameOnFocus);
    };
  }, []);

  return (
    <GameBoardProvider>
      <GameRoom />
      {blocker ? <ConfirmNavigationMidGame blocker={blocker} /> : null}
    </GameBoardProvider>
  );
};

export default GameRoomPage;
