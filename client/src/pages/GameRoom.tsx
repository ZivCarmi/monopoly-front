import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import GameRoom from "@/components/game-room/GameRoom";
import GameBoardProvider from "@/components/board/GameBoardProvider";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GameRoomPage = () => {
  const { roomId } = useParams();
  const { isInRoom } = useAppSelector((state) => state.game);
  const isFirstRender = useRef(true);
  const socket = useSocket();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onRoomNotAvailable = () => {
    navigate("/");
    toast({
      title: `Couldn't find room ${roomId}`,
      description: "It has been deleted or expired",
      variant: "destructive",
    });
  };

  useEffect(() => {
    if (roomId && !isInRoom && isFirstRender.current) {
      socket.emit("join_room", { roomId });
      isFirstRender.current = false;
    }

    socket.on("room_not_available", onRoomNotAvailable);

    return () => {
      socket.off("room_not_available", onRoomNotAvailable);
    };
  }, []);

  return (
    <GameBoardProvider>
      <GameRoom />
    </GameBoardProvider>
  );
};

export default GameRoomPage;
