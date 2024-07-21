import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import PlayerMoney from "@/components/player/PlayerMoney";
import PlayerName from "@/components/player/PlayerName";
import PlayerNamePlate from "@/components/player/PlayerNamePlate";
import CountdownTimer from "@/components/ui/countdown-timer";
import { cn, getPlayerName, isPlayerTurn } from "@/utils";
import { Player, isGameNotStarted } from "@ziv-carmi/monopoly-utils";
import { motion } from "framer-motion";
import { Crown, FlagTriangleRight, WifiOff, X } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

const PlayerRow = ({ player }: { player: Player }) => {
  const { state, selfPlayer, hostId } = useAppSelector((state) => state.game);

  return (
    <motion.div
      className={cn(
        "flex items-center text-center p-2 relative rounded-lg",
        selfPlayer?.id === player.id && "bg-background/50"
      )}
      layout
    >
      {isPlayerTurn(player.id) && <TurnIndicator player={player} />}
      <PlayerNamePlate>
        <PlayerCharacter color={player.color} />
        <PlayerName name={player.name} className="text-sm" />
        <HostIndicator playerId={player.id} />
        {!player.isConnected && player.connectionKickAt && (
          <NotConnectedIndicator connectionKickAt={player.connectionKickAt} />
        )}
      </PlayerNamePlate>
      <div className="grow text-end px-4">
        {isGameNotStarted(state) ? (
          <>
            {hostId === selfPlayer?.id && <KickPlayer playerId={player.id} />}
            <ChangeAppearanceButton playerId={player.id} />
          </>
        ) : player.bankrupted ? (
          <BankruptedIndicator />
        ) : (
          <PlayerMoney money={player.money} />
        )}
      </div>
    </motion.div>
  );
};

const KickPlayer = ({ playerId }: { playerId: string }) => {
  const socket = useSocket();
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (selfPlayer?.id === playerId) {
    return null;
  }

  const kickPlayerHandler = () => {
    const playerName = getPlayerName(playerId);
    if (
      confirm(
        `האם אתה בטוח שברצונך להסיר את ${playerName}?\nלא ניתן יהיה לבטל פעולה זו.`
      )
    ) {
      socket.emit("votekick_player", playerId);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={kickPlayerHandler}
            size="icon"
            variant="ghost"
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">סגור</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>הסר שחקן</TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <motion.div
      className="w-1 rounded-tl-full rounded-bl-full absolute top-0 bottom-0 -right-4"
      style={{ backgroundColor: player.color }}
      layoutId="sideline"
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
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 text-red-500 animate-pulse">
            <WifiOff className="w-4 h-4" />
            <CountdownTimer date={connectionKickAt} />
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
