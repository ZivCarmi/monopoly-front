import { BASE_URL } from "@/api/config";
import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context2";
import GameRoom from "@/components/GameRoom";
import { ToastProps } from "@/components/ui/toast";
import Room from "@backend/classes/Room";
import { useEffect } from "react";
import { json, useLoaderData, useNavigate, useParams } from "react-router-dom";
import type { Params } from "react-router-dom";

const GameRoomPage = () => {
  const { isInRoom } = useAppSelector((state) => state.game);
  const socket = useSocket();
  const gameRoomData = useLoaderData() as Room;
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameRoomData) {
      navigate("/", {
        replace: true,
        state: {
          toast: {
            title: `Couldn't find room ${roomId}`,
            description: "It has been deleted or expired",
            variant: "destructive",
          } as ToastProps,
        },
      });
    }

    if (gameRoomData && !isInRoom) {
      socket.emit("join_game", { roomId });
    }
  }, []);

  return <GameRoom />;
};

export const getGameRoomData = async ({
  params,
}: {
  params: Params<"roomId">;
}) => {
  const response = await fetch(`${BASE_URL}/rooms/${params.roomId}`);

  if (!response.ok) {
    throw json({ message: "Error, could not get room data" }, { status: 500 });
  }

  const responseJson = await response.json();

  if (!responseJson.room) {
    return null;
  }

  return responseJson;
};

export default GameRoomPage;
