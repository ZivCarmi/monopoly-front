import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { CharacterSelection } from "@/components/game-room/PlayersForm";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import PlayerMoney from "@/components/player/PlayerMoney";
import PlayerName from "@/components/player/PlayerName";
import PlayerNamePlate from "@/components/player/PlayerNamePlate";
import CountdownTimer from "@/components/ui/countdown-timer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  cn,
  getAllColors,
  getPlayerName,
  isColorTaken,
  isPlayerTurn,
} from "@/utils";
import { Colors, Player, isGameNotStarted } from "@ziv-carmi/monopoly-utils";
import { motion } from "framer-motion";
import { Crown, FlagTriangleRight, WifiOff, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

const PlayerRow = ({ player }: { player: Player }) => {
  const { state, selfPlayer, hostId } = useAppSelector((state) => state.game);
  const isSelfPlayer = selfPlayer?.id === player.id;

  return (
    <motion.div
      className={cn(
        "flex items-center text-center p-2 relative rounded-lg",
        isSelfPlayer && "bg-background/50"
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
            {isSelfPlayer && <ChangeAppearanceButton />}
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

const ChangeAppearanceButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();

  const changeColorHandler = (color: Colors) => {
    socket.emit("change_color", color);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="mx-auto text-xs">
          שנה נראות
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 grid grid-cols-4 place-items-center gap-x-2 gap-y-4">
        {getAllColors().map((color) => {
          const takenColor = isColorTaken(color);

          return (
            <button key={color} onClick={() => changeColorHandler(color)}>
              <CharacterSelection
                size={1.5}
                color={color}
                isDisabled={takenColor}
              />
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
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
