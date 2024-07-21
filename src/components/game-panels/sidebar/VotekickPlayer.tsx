import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import PlayerName from "@/components/player/PlayerName";
import PlayerNamePlate from "@/components/player/PlayerNamePlate";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { selectCurrentPlayerTurn } from "@/slices/game-slice";
import { UserX } from "lucide-react";

const VotekickPlayer = () => {
  const socket = useSocket();
  const { selfPlayer, voteKickers } = useAppSelector((state) => state.game);
  const currentPlayer = useAppSelector(selectCurrentPlayerTurn);

  if (!currentPlayer || !selfPlayer) {
    return null;
  }

  const didVote = voteKickers.includes(selfPlayer.id);
  const isDisabled = selfPlayer.id === currentPlayer.id || didVote;

  const voteKickHandler = () => {
    socket.emit("votekick_player");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={voteKickHandler}
            variant="outline"
            disabled={isDisabled}
          >
            <Icon icon={UserX} />
            העמד להדחה
          </Button>
        </TooltipTrigger>
        <TooltipContent className="inline-flex gap-3 items-center">
          הדח את{" "}
          <PlayerNamePlate>
            <PlayerCharacter color={currentPlayer.color} />
            <PlayerName name={currentPlayer.name} />
          </PlayerNamePlate>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VotekickPlayer;
