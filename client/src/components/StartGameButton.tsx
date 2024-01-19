import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context2";
import { Button } from "./ui/button";
import { selectPlayers } from "@/slices/game-slice";
import Icon from "./ui/icon";
import { Play } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StartGameButton = () => {
  const players = useAppSelector(selectPlayers);
  const socket = useSocket();

  const startGameHandler = () => {
    socket.emit("start_game");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button onClick={startGameHandler} disabled={players.length < 2}>
                <Icon icon={Play} />
                התחל משחק
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>בשביל להתחיל משחק צריך לפחות 2 שחקנים</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StartGameButton;
