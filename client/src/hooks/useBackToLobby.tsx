import { useSocket } from "@/app/socket-context";
import { useNavigate } from "react-router-dom";

const useBackToLobby = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const backToLobbyHandler = async () => {
    socket.emit("back_to_lobby");
    navigate("/");
  };

  return backToLobbyHandler;
};

export default useBackToLobby;
