import { useSocket } from "@/app/socket-context2";
import { Button } from "../ui/button";

const BackToLobbyButton = () => {
  const socket = useSocket();

  const backToLobbyHandler = async () => {
    socket.emit("back_to_lobby");
  };

  return <Button onClick={backToLobbyHandler}>חזרה ללובי</Button>;
};

export default BackToLobbyButton;
