import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { setLobbyRooms } from "@/slices/lobby-slice";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import LobbyGameRoomsActions from "./LobbyGameRoomsActions";
import LobbyGameRoomsList from "./LobbyGameRoomsList";
import NoRoomsAvailable from "./NoRoomsAvailable";

const LobbyGameRooms = () => {
  const { lobbyRooms } = useAppSelector((state) => state.lobby);
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const setRooms = (lobbyRooms: LobbyRoom[]) => {
    dispatch(setLobbyRooms(lobbyRooms));
  };

  useEffect(() => {
    socket.on("rooms_list", setRooms);

    return () => {
      socket.off("rooms_list", setRooms);
    };
  }, []);

  return (
    <div className="m-auto w-full md:w-[500px] bg-background border shadow-md p-6 rounded-lg overflow-hidden">
      <LobbyGameRoomsActions />
      {lobbyRooms.length > 0 ? <LobbyGameRoomsList /> : <NoRoomsAvailable />}
    </div>
  );
};

export default LobbyGameRooms;
