import { useSocket } from "@/app/socket-context";
import LobbyGameRooms from "@/components/lobby/LobbyGameRooms";
import { useEffect } from "react";

const LobbyRoomsPage = () => {
  const socket = useSocket();

  useEffect(() => {
    return () => {
      socket.emit("lobby");
    };
  }, []);

  return <LobbyGameRooms />;
};

export default LobbyRoomsPage;
