import { useAppSelector } from "@/app/hooks";
import PlayerCharacter from "@/components/player/PlayerCharacter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getPlayerColor, getPlayerName } from "@/utils";
import { ChatMessage } from "@ziv-carmi/monopoly-utils";
import { motion } from "framer-motion";

const ChatMessageItem = ({ message }: { message: ChatMessage }) => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const name = getPlayerName(message.playerId);
  const color = getPlayerColor(message.playerId);
  const isSelfPlayer = selfPlayer?.id === message.playerId;

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.5 }, layout: { duration: 0.25 } }}
      style={{ originX: isSelfPlayer ? 0 : 1 }}
      layout
    >
      <div
        className={cn(
          "flex gap-2 items-start",
          isSelfPlayer && "flex-row-reverse"
        )}
      >
        {color && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative top-1">
                  <PlayerCharacter color={color} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-sm">{name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div
          className={cn(
            "bg-accent py-2 px-4 rounded-md text-sm [unicode-bidi:plaintext] [word-break:break-word]",
            isSelfPlayer ? "rounded-tl-[0.125rem]" : "rounded-tr-[0.125rem]"
          )}
        >
          {message.text}
        </div>
      </div>
    </motion.li>
  );
};

export default ChatMessageItem;
