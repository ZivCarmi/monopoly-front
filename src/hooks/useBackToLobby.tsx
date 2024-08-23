import { resetGameRoom } from "@/actions/lobby-actions";
import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";

const useBackToLobby = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const backToLobbyHandler = () => {
    socket.emit("return_to_lobby", () => {
      dispatch(resetGameRoom());
    });
  };

  return backToLobbyHandler;
};

export default useBackToLobby;
