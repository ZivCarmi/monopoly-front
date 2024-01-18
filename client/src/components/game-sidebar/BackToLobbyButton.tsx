import { useSocket } from "@/app/socket-context2";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Icon from "../ui/icon";

const BackToLobbyButton = () => {
  const socket = useSocket();

  const backToLobbyHandler = async () => {
    socket.emit("back_to_lobby");
  };

  return (
    <Button onClick={backToLobbyHandler} asChild>
      <Link to="/">
        <Icon icon={X} />
        חזרה ללובי
      </Link>
    </Button>
  );
};

export default BackToLobbyButton;
