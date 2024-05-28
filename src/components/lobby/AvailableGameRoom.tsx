import useJoinRoom from "@/hooks/useJoinRoom";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";
import GameRoomPlayers from "./GameRoomPlayerIcons";
import GameRoomSettings from "./GameRoomSettingsIcons";

const AvailableGameRoom = ({ room }: { room: LobbyRoom }) => {
  const joinRoom = useJoinRoom();

  const joinRoomHandler = (roomId: string) => {
    joinRoom({ roomId });
  };

  return (
    <li>
      <button
        onClick={() => joinRoomHandler(room.id)}
        className="w-full rounded-lg text-left rtl:text-right bg-popover hover:bg-card duration-200 text-sm flex justify-between"
      >
        <div className="p-4">
          <h2 className="font-bold tracking-wider mb-2 text-muted-foreground">
            {room.id}
          </h2>
          <GameRoomPlayers
            players={room.players}
            maxPlayers={room.settings.maxPlayers}
          />
        </div>
        <div className="bg-primary/10 rounded-lg p-4 flex self-stretch items-end gap-3 relative">
          <GameRoomSettings room={room} />
        </div>
      </button>
    </li>
  );
};

export default AvailableGameRoom;
