import { getRoomsHandler, handleRoomJoin } from "@/actions/game-actions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { useSocket } from "@/app/socket-context";
import { ArrowLeft, PlusSquare, RefreshCcw } from "lucide-react";
import CreateRoom from "./CreateRoom";

const LobbyGameRooms = ({ onGoBack }: { onGoBack: () => void }) => {
  const dispatch = useAppDispatch();
  const { lobbyRooms } = useAppSelector((state) => state.lobby);
  const { socket } = useSocket();

  const fetchAllRooms = () => {
    if (!socket) return;

    dispatch(getRoomsHandler(socket));
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

  if (!socket) {
    return null;
  }

  return (
    <div className="md:w-[500px] bg-card border p-6 rounded-lg overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="outline" onClick={onGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
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
      {lobbyRooms.length > 0 ? (
        <>
          <p className="text-center text-sm mb-4 text-muted-foreground">
            Select the room you would like to join:
          </p>
          <ul className="space-y-2 max-h-[300px] overflow-auto">
            {lobbyRooms.map((room) => (
              <li key={room.id} className="pe-2">
                <button
                  onClick={() => dispatch(handleRoomJoin(socket, room.id))}
                  className="w-full p-4 rounded-lg text-left space-y-1 bg-background border hover:bg-muted/50 transition-colors text-sm"
                >
                  <h2>
                    <strong>Room ID:</strong> {room.id}
                  </h2>
                  <div>
                    <strong>Players:</strong> {room.participantsCount}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-muted-foreground h-[100px] flex items-center justify-center text-center">
          No Rooms Available
        </p>
      )}
    </div>
  );
};

export default LobbyGameRooms;
