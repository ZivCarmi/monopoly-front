import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { Button } from "../ui/button";
import { selectPlayers } from "@/slices/game-slice";
import Icon from "../ui/icon";
import { Play } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StartGameButton = () => {
  const players = useAppSelector(selectPlayers);
  const canStart = players.length > 1;

  return canStart ? (
    <StartButton canStart={canStart} />
  ) : (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <StartButton canStart={canStart} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>בשביל להתחיל משחק צריך לפחות 2 שחקנים</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const StartButton = ({ canStart }: { canStart: boolean }) => {
  const socket = useSocket();

  const startGameHandler = () => {
    socket.emit("start_game");
  };

  return (
    <Button onClick={startGameHandler} disabled={!canStart}>
      <Icon icon={Play} />
      התחל משחק
    </Button>
  );
};

export default StartGameButton;
