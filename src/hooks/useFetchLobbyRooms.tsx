import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { setIsFetching } from "@/slices/lobby-slice";

const useFetchLobbyRooms = () => {
  const socket = useSocket();
  const { isFetching } = useAppSelector((state) => state.lobby);
  const dispatch = useAppDispatch();

  const fetchAllRooms = () => {
    if (isFetching) return;

    dispatch(setIsFetching(true));
    socket.emit("get_lobby_rooms");
  };

  return fetchAllRooms;
};

export default useFetchLobbyRooms;
