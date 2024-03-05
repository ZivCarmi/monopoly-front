import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import PlayerNamePlate from "@/components/player/PlayerNamePlate";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import PlayerName from "@/components/player/PlayerName";
import { cn, getPlayerColor } from "@/utils";
import { Player } from "@ziv-carmi/monopoly-utils";
import { Crown } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import PlayerMoney from "@/components/player/PlayerMoney";

const PlayerRow = ({ player }: { player: Player }) => {
  const { started } = useAppSelector((state) => state.game);
  const socket = useSocket();

  return (
    <div
      className={cn(
        "flex items-center text-center p-2 relative rounded-lg",
        socket.id === player.id && "bg-background/50"
      )}
    >
      <TurnIndicator playerId={player.id} />
      <div className="flex items-center gap-3">
        <PlayerNamePlate>
          <PlayerCharacter character={player.character} />
          <PlayerName
            name={player.name}
            color={player.color}
            className="text-sm"
          />
        </PlayerNamePlate>
        <HostIndicator playerId={player.id} />
      </div>
      <div className="grow text-end px-4">
        {started ? (
          <PlayerMoney money={player.money} />
        ) : (
          <ChangeAppearanceButton playerId={player.id} />
        )}
      </div>
    </div>
  );
};

const ChangeAppearanceButton = ({ playerId }: { playerId: string }) => {
  const socket = useSocket();

  if (socket.id !== playerId) {
    return null;
  }

  return (
    <Button variant="ghost" className="mx-auto text-xs">
      שנה נראות
    </Button>
  );
};

const TurnIndicator = ({ playerId }: { playerId: string }) => {
  const { currentPlayerTurnId } = useAppSelector((state) => state.game);
  const playerColor = getPlayerColor(playerId);
  const isPlayerTurn = currentPlayerTurnId === playerId;

  return (
    <div
      className="w-1 rounded-tl-full rounded-bl-full absolute top-0 bottom-0 -right-4"
      style={isPlayerTurn ? { backgroundColor: playerColor } : {}}
    />
  );
};

const HostIndicator = ({ playerId }: { playerId: string }) => {
  const { roomHostId } = useAppSelector((state) => state.game);

  if (playerId !== roomHostId) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Crown className="w-4 h-4 text-amber-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p>מארח החדר</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlayerRow;
