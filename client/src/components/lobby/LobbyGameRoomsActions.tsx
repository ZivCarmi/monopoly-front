import { useEffect } from "react";
import { Button } from "../ui/button";
import { useSocket } from "@/app/socket-context2";
import { ArrowLeft, ArrowRight, PlusSquare, RefreshCcw } from "lucide-react";
import CreateRoom from "../CreateRoom";
import { Link } from "react-router-dom";
import Icon from "../ui/icon";

const LobbyGameRoomsActions = () => {
  const socket = useSocket();

  const fetchAllRooms = () => {
    socket.emit("get_rooms");
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
        <CreateRoom>
          <Icon icon={PlusSquare} />
          חדר חדש
        </CreateRoom>
      </div>
    </div>
  );
};

export default LobbyGameRoomsActions;
