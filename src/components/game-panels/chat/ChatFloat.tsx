import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { setToggleChat } from "@/slices/game-slice";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { MessagesSquare } from "lucide-react";
import ChatPanelContent from "./ChatPanelContent";
import { AnimatePresence, motion } from "framer-motion";

const ChatFloat = () => {
  const { isChatOpen, unreadMessages } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  return (
    <Sheet
      open={isChatOpen}
      onOpenChange={(open) => dispatch(setToggleChat(open))}
    >
      <SheetTrigger asChild>
        <Button className="w-16 h-16 fixed bottom-4 left-4 z-[60] rounded-full">
          <MessagesSquare className="w-8 h-8" />
          <AnimatePresence>
            {unreadMessages && (
              <motion.span
                className="w-6 h-6 p-1 absolute -top-1 -right-1 bg-red-500 rounded-full text-sm flex items-center justify-center drop-shadow-lg [text-shadow:_0_2px_8px_#000]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                {unreadMessages}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[calc(100%-2rem)] h-[calc(100dvh-6rem*2)] p-0 right-4 left-4 top-24 sm:right-auto border-none"
      >
        <SheetTitle>
          <VisuallyHidden.Root>צ'אט</VisuallyHidden.Root>
        </SheetTitle>
        <SheetDescription>
          <VisuallyHidden.Root>
            הודעות צ'אט עם שחקנים אחרים במשחק
          </VisuallyHidden.Root>
        </SheetDescription>
        <ChatPanelContent className="h-full" />
      </SheetContent>
    </Sheet>
  );
};

export default ChatFloat;
