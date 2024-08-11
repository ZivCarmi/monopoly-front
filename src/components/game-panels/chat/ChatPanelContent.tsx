import { useAppSelector } from "@/app/hooks";
import GamePanel from "../GamePanel";
import PanelTitle from "../PanelTitle";
import ChatMessageForm from "./ChatMessageForm";
import ChatMessages from "./ChatMessages";
import { HTMLMotionProps } from "framer-motion";
import ChatVolume from "./ChatVolume";

interface ChatPanelContentProps extends HTMLMotionProps<"div"> {}

const ChatPanelContent = ({ ...props }: ChatPanelContentProps) => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  return (
    <GamePanel {...props}>
      <div className="flex gap-4 shadow-primary/15 shadow-2xl p-4 relative">
        <PanelTitle className="grow p-0">צ'אט</PanelTitle>
        <ChatVolume />
      </div>
      <ChatMessages />
      <div className="p-4 border-t">
        {!!selfPlayer ? (
          <ChatMessageForm />
        ) : (
          <div className="text-muted-foreground text-center">
            רק שחקנים יכולים לשלוח הודעות צ'אט
          </div>
        )}
      </div>
    </GamePanel>
  );
};

export default ChatPanelContent;
