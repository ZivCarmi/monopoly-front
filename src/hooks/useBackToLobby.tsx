import { useSocket } from "@/app/socket-context";

const useBackToLobby = (shouldReturnToLobby: boolean = true) => {
  const socket = useSocket();

  const backToLobbyHandler = () => {
    socket.emit("return_to_lobby", shouldReturnToLobby);
  };

  return backToLobbyHandler;
};

export default useBackToLobby;
