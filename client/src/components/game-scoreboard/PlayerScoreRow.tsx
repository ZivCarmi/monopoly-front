import { useSocket } from "@/app/socket-context2";
import Player from "@backend/types/Player";
import { Button } from "../ui/button";
import { useAppSelector } from "@/app/hooks";
import { Crown } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn, getPlayerColor } from "@/utils";

const PlayerScoreRow = ({ player }: { player: Player }) => {
  const { started } = useAppSelector((state) => state.game);
  const socket = useSocket();

  return (
    <tr
      className={cn(
        "text-center h-[56px]",
        socket.id === player.id && "bg-background"
      )}
    >
      <TurnIndicator playerId={player.id} />
      <td className="text-right p-2" width="50%">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 space-x-reverse">
            <img
              src={`/${player.character}.png`}
              width={32}
              className="inline-block"
            />
            <span className="break-all">{player.name}</span>
          </div>
        </div>
      </td>
      <td className="text-right p-2">
        {started ? (
          <>${player.money}</>
        ) : (
          <ChangeAppearanceButton playerId={player.id} />
        )}
      </td>
      <td className="p-2 pr-0 rounded-tl-lg rounded-bl-lg">
        <HostIndicator playerId={player.id} />
      </td>
    </tr>
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
    <td className="rounded-tr-full rounded-br-full p-2 pl-0">
      <div
        className="w-1 h-[56px] rounded-tl-full rounded-bl-full absolute right-0 transform -translate-y-1/2"
        style={isPlayerTurn ? { backgroundColor: playerColor } : {}}
      />
    </td>
  );
};

const HostIndicator = ({ playerId }: { playerId: string }) => {
  const { roomHostId } = useAppSelector((state) => state.game);

  if (playerId !== roomHostId) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge>
            <Crown size={14} />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>מארח החדר</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlayerScoreRow;
