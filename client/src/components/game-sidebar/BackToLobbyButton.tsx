import { useSocket } from "@/app/socket-context2";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const BackToLobbyButton = () => {
  const socket = useSocket();

  const backToLobbyHandler = async () => {
    socket.emit("back_to_lobby");
  };

  return (
    <Button asChild onClick={backToLobbyHandler}>
      <Link to="/">חזרה ללובי</Link>
    </Button>
  );
};

export default BackToLobbyButton;
