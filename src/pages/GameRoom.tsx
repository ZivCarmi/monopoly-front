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
  const joinRoom = useJoinRoom();

  useEffect(() => {
    if (roomId && !isInRoom && isFirstRender.current) {
      joinRoom({ roomId });
      isFirstRender.current = false;
    }
  }, []);

  return (
    <GameRoomProvider>
      <GameRoom />
    </GameRoomProvider>
  );
};

export default GameRoomPage;
