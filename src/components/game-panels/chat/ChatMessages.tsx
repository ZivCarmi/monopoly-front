import { useAppSelector } from "@/app/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import ChatMessageItem from "./ChatMessageItem";
import { AnimatePresence } from "framer-motion";

const ChatMessages = () => {
  const { messages } = useAppSelector((state) => state.game);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef !== null && viewportRef.current !== null) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea
      className="h-72 rounded-md grow"
      viewportRef={viewportRef}
      dir="rtl"
    >
      <ul className="space-y-2 p-4">
        <AnimatePresence initial={false} mode="popLayout">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
        </AnimatePresence>
      </ul>
    </ScrollArea>
  );
};

export default ChatMessages;
