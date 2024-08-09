import { useAppSelector } from "@/app/hooks";
import GamePanel from "../GamePanel";
import PanelTitle from "../PanelTitle";
import ChatMessageForm from "./ChatMessageForm";
import ChatMessages from "./ChatMessages";
import { HTMLMotionProps } from "framer-motion";

interface ChatPanelContentProps extends HTMLMotionProps<"div"> {}

const ChatPanelContent = ({ ...props }: ChatPanelContentProps) => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  return (
    <GamePanel {...props}>
      <PanelTitle className="shadow-primary/15 shadow-2xl">צ'אט</PanelTitle>
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
