import { useSocket } from "@/app/socket-context";
import { ArrowRight, PlusSquare, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import useJoinRoom from "@/hooks/useJoinRoom";

const LobbyGameRoomsActions = () => {
  const socket = useSocket();
  const createRoom = useJoinRoom();

  const fetchAllRooms = () => {
    socket.emit("get_lobby_rooms");
  };

  useEffect(() => {
    fetchAllRooms();

    const fetchRoomsInterval = setInterval(() => {
      fetchAllRooms();
    }, 10000);

    return () => {
      clearInterval(fetchRoomsInterval);
    };
  }, []);

  return (
    <div className="mb-8 flex items-center justify-between">
      <Button asChild variant="outline">
        <Link to="/">
          <Icon icon={ArrowRight} />
          חזור
        </Link>
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" onClick={fetchAllRooms}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button onClick={() => createRoom()} variant="primaryFancy">
          <Icon icon={PlusSquare} />
          חדר חדש
        </Button>
      </div>
    </div>
  );
};

export default LobbyGameRoomsActions;
