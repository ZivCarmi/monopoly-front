import { useAppSelector } from "@/app/hooks";
import GameRoom from "@/components/game-room/GameRoom";
import GameRoomProvider from "@/components/game-room/GameRoomProvider";
import useJoinRoom from "@/hooks/useJoinRoom";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const GameRoomPage = () => {
  const { roomId } = useParams();
  const { isInRoom } = useAppSelector((state) => state.game);
  const isFirstRender = useRef(true);
  // const socket = useSocket();
  const joinRoom = useJoinRoom();

  useEffect(() => {
    if (roomId && !isInRoom && isFirstRender.current) {
      joinRoom({ roomId });
      isFirstRender.current = false;
    }

    // const updateGameOnFocus = () => {
    //   socket.emit("update_game");
    // };

    // window.addEventListener("visibilitychange", updateGameOnFocus);

    // return () => {
    //   window.removeEventListener("visibilitychange", updateGameOnFocus);
    // };
  }, []);

  return (
    <GameRoomProvider>
      <GameRoom />
    </GameRoomProvider>
  );
};

export default GameRoomPage;
