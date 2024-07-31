import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import useFetchLobbyRooms from "@/hooks/useFetchLobbyRooms";
import {
  setIsFetching,
  setLobbyRooms,
  setNextUpdate,
} from "@/slices/lobby-slice";
import { LobbyRoomsResponse } from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import LobbyGameRoomsActions from "./LobbyGameRoomsActions";
import LobbyGameRoomsList from "./LobbyGameRoomsList";
import NoRoomsAvailable from "./NoRoomsAvailable";

const LobbyGameRooms = () => {
  const { lobbyRooms } = useAppSelector((state) => state.lobby);
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const fetchLobbyRooms = useFetchLobbyRooms();

  useEffect(() => {
    fetchLobbyRooms();

    const setRooms = ({ rooms, nextUpdateAt }: LobbyRoomsResponse) => {
      dispatch(setLobbyRooms(rooms));
      dispatch(setIsFetching(false));
      dispatch(setNextUpdate(nextUpdateAt));
    };

    socket.on("rooms_list", setRooms);

    return () => {
      socket.off("rooms_list", setRooms);
    };
  }, []);

  return (
    <div className="m-auto w-full md:w-[500px] bg-background border shadow-md p-4 rounded-lg overflow-hidden">
      <LobbyGameRoomsActions />
      {lobbyRooms.length > 0 ? <LobbyGameRoomsList /> : <NoRoomsAvailable />}
    </div>
  );
};

export default LobbyGameRooms;
