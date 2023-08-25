import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { Button } from "./ui/button";
import { selectPlayers } from "@/slices/game-slice";

const StartGameButton = () => {
  const players = useAppSelector(selectPlayers);
  const { socket } = useSocket();

  if (!socket) {
    return null;
  }

  const startGameHandler = () => {
    socket.emit("start_game");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Button onClick={startGameHandler} disabled={players.length < 2}>
        Start game
      </Button>
    </div>
  );
};

export default StartGameButton;
