import { useEffect } from "react";
import { Button } from "../ui/button";
import { useSocket } from "@/app/socket-context2";
import { ArrowLeft, PlusSquare, RefreshCcw } from "lucide-react";
import CreateRoom from "../CreateRoom";
import { Link } from "react-router-dom";

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
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <div className="space-x-2">
        <Button variant="outline" onClick={fetchAllRooms}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <CreateRoom>
          <PlusSquare className="mr-2 h-4 w-4" />
          New Room
        </CreateRoom>
      </div>
    </div>
  );
};

export default LobbyGameRoomsActions;
