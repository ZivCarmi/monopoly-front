import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleChatSound } from "@/slices/game-slice";
import { Volume2, VolumeX } from "lucide-react";

const ChatVolume = () => {
  const { chatSound } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const text = `${chatSound ? "השתק" : "הפעל"} צ'אט`;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-sm opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
            onClick={() => dispatch(toggleChatSound())}
          >
            {chatSound ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
            <span className="sr-only">{text}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChatVolume;
