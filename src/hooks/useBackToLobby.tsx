import { useSocket } from "@/app/socket-context";

const useBackToLobby = () => {
  const socket = useSocket();

  const backToLobbyHandler = () => {
    socket.emit("back_to_lobby");
  };

  return backToLobbyHandler;
};

export default useBackToLobby;
