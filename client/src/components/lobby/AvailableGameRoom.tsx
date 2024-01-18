import { useSocket } from "@/app/socket-context2";
import { LobbyRoom } from "@backend/classes/Room";
import { User } from "lucide-react";
import { Badge } from "../ui/badge";

const AvailableGameRoom = ({ room }: { room: LobbyRoom }) => {
  const socket = useSocket();
  const roomSpectatorsCount = room.connectedSockets - room.players.length;

  const joinRoomHandler = (roomId: string) => {
    socket.emit("join_game", { roomId });
  };

  return (
    <li className="pe-2">
      <button
        onClick={() => joinRoomHandler(room.id)}
        className="w-full p-4 rounded-lg text-left space-y-1 bg-background border hover:bg-muted/50 transition-colors text-sm relative"
      >
        {room.started && (
          <Badge className="absolute top-2 right-2">In Progress</Badge>
        )}
        <h2>
          <strong>Room ID:</strong> {room.id}
        </h2>
        <div>
          <strong>Participants:</strong> {room.connectedSockets}
        </div>
        <div className="flex items-center">
          <strong>Players:</strong>&nbsp;
          <ul className="flex items-center gap-[2px]">
            {Object.values(room.players).map((player) => (
              <li key={player.id}>
                <img src={`/${player.character}.png`} width={24} />
              </li>
            ))}
            {Array.from({ length: roomSpectatorsCount }, (_, idx) => (
              <li key={idx}>
                <User size={18} width={24} />
              </li>
            ))}
          </ul>
        </div>
      </button>
    </li>
  );
};

export default AvailableGameRoom;
