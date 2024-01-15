import { useSocket } from "@/app/socket-context2";
import Room from "@backend/classes/Room";
import { User } from "lucide-react";

const AvailableGameRoom = ({ room }: { room: Room }) => {
  const socket = useSocket();
  const roomSpectatorsCount =
    room.participantsCount - Object.keys(room.players).length;

  const joinRoomHandler = (roomId: string) => {
    socket.emit("join_game", { roomId });
  };

  return (
    <li className="pe-2">
      <button
        onClick={() => joinRoomHandler(room.id)}
        className="w-full p-4 rounded-lg text-left space-y-1 bg-background border hover:bg-muted/50 transition-colors text-sm"
      >
        <h2>
          <strong>Room ID:</strong> {room.id}
        </h2>
        <div>
          <strong>Participants:</strong> {room.participantsCount}
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
