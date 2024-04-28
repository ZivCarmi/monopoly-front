import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import GameBoardProvider from "@/components/board/GameBoardProvider";
import GameRoom from "@/components/game-room/GameRoom";
import useJoinRoom from "@/hooks/useJoinRoom";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const GameRoomPage = () => {
  const { roomId } = useParams();
  const { isInRoom } = useAppSelector((state) => state.game);
  const isFirstRender = useRef(true);
  const socket = useSocket();
  const joinRoom = useJoinRoom();

  const updateGameOnFocus = () => {
    socket.emit("update_game");
  };

  useEffect(() => {
    if (roomId && !isInRoom && isFirstRender.current) {
      joinRoom({ roomId });
      isFirstRender.current = false;
    }

    window.addEventListener("visibilitychange", updateGameOnFocus);

    return () => {
      window.removeEventListener("visibilitychange", updateGameOnFocus);
    };
  }, []);

  return (
    <GameBoardProvider>
      <GameRoom />
    </GameBoardProvider>
  );
};

export default GameRoomPage;
