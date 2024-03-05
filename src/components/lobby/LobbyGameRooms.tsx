import { useAppDispatch, useAppSelector } from "@/app/hooks";
import LobbyGameRoomsActions from "./LobbyGameRoomsActions";
import LobbyGameRoomsList from "./LobbyGameRoomsList";
import NoRoomsAvailable from "./NoRoomsAvailable";
import { useSocket } from "@/app/socket-context";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";
import { setLobbyRooms } from "@/slices/lobby-slice";
import { useEffect } from "react";

const LobbyGameRooms = () => {
  const { lobbyRooms } = useAppSelector((state) => state.lobby);
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const setRooms = ({ rooms }: { rooms: LobbyRoom[] }) => {
    dispatch(setLobbyRooms(rooms));
  };

  useEffect(() => {
    socket.on("rooms_list", setRooms);

    return () => {
      socket.off("rooms_list", setRooms);
    };
  }, []);

  return (
    <div className="md:w-[500px] bg-card border p-6 rounded-lg overflow-hidden">
      <LobbyGameRoomsActions />
      {lobbyRooms.length > 0 ? <LobbyGameRoomsList /> : <NoRoomsAvailable />}
    </div>
  );
};

export default LobbyGameRooms;
