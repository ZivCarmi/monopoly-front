import { useAppSelector } from "@/app/hooks";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import PlayerMoney from "@/components/player/PlayerMoney";
import PlayerName from "@/components/player/PlayerName";
import PlayerNamePlate from "@/components/player/PlayerNamePlate";
import { cn, getTimeValues, isPlayerTurn } from "@/utils";
import { Player, isGameNotStarted } from "@ziv-carmi/monopoly-utils";
import { Crown, FlagTriangleRight, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

const PlayerRow = ({ player }: { player: Player }) => {
  const { state, selfPlayer } = useAppSelector((state) => state.game);

  return (
    <div
      className={cn(
        "flex items-center text-center p-2 relative rounded-lg",
        selfPlayer?.id === player.id && "bg-background/50"
      )}
    >
      <TurnIndicator player={player} />
      <PlayerNamePlate>
        <PlayerCharacter character={player.character} />
        <PlayerName
          name={player.name}
          color={player.color}
          className="text-sm"
        />
        <HostIndicator playerId={player.id} />
        {!player.isConnected && player.connectionKickAt && (
          <NotConnectedIndicator connectionKickAt={player.connectionKickAt} />
        )}
      </PlayerNamePlate>
      <div className="grow text-end px-4">
        {isGameNotStarted(state) ? (
          <ChangeAppearanceButton playerId={player.id} />
        ) : player.bankrupted ? (
          <BankruptedIndicator />
        ) : (
          <PlayerMoney money={player.money} />
        )}
      </div>
    </div>
  );
};

const ChangeAppearanceButton = ({ playerId }: { playerId: string }) => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (selfPlayer?.id !== playerId) {
    return null;
  }

  return (
    <Button variant="ghost" className="mx-auto text-xs">
      שנה נראות
    </Button>
  );
};

const BankruptedIndicator = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <FlagTriangleRight className="w-4 h-4 text-red-500 mr-auto" />
        </TooltipTrigger>
        <TooltipContent>
          <p>פשט רגל</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TurnIndicator = ({ player }: { player: Player }) => {
  return (
    <div
      className="w-1 rounded-tl-full rounded-bl-full absolute top-0 bottom-0 -right-4"
      style={isPlayerTurn(player.id) ? { backgroundColor: player.color } : {}}
    />
  );
};

const HostIndicator = ({ playerId }: { playerId: string }) => {
  const { hostId } = useAppSelector((state) => state.game);

  if (playerId !== hostId) {
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

const NotConnectedIndicator = ({
  connectionKickAt,
}: {
  connectionKickAt: Date;
}) => {
  const [countdown, setCountdown] = useState(
    new Date(connectionKickAt).getTime() - new Date().getTime()
  );
  const { minutes, seconds } = getTimeValues(countdown);

  useEffect(() => {
    if (countdown <= 1000) return;

    const interval = setInterval(() => {
      setCountdown((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 text-red-500 animate-pulse duration-[1500]">
            <WifiOff className="w-4 h-4" />
            <time>
              {minutes}:{seconds}
            </time>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>שחקן לא מחובר</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlayerRow;
