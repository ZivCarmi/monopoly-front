import { useAppSelector } from "@/app/hooks";
import AvailableGameRoom from "./AvailableGameRoom";

const LobbyGameRoomsList = () => {
  const { lobbyRooms } = useAppSelector((state) => state.lobby);

  return (
    <>
      <p className="text-center text-sm mb-4 text-muted-foreground">
        Select the room you would like to join:
      </p>
      <ul className="space-y-2 max-h-[300px] overflow-auto">
        {lobbyRooms.map((room) => (
          <AvailableGameRoom key={room.id} room={room} />
        ))}
      </ul>
    </>
  );
};

export default LobbyGameRoomsList;
