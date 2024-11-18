import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetOverlay,
  SheetTitle,
} from "@/components/ui/sheet";
import { toggleChat } from "@/slices/game-slice";
import { cn } from "@/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { MessagesSquare, X } from "lucide-react";
import ChatPanelContent from "./ChatPanelContent";
import useWindowSize from "@/hooks/useWindowSize";

const XIconMotion = motion(X);
const MessagesSquareIconMotion = motion(MessagesSquare);

const ChatFloat = () => {
  const { isChatOpen, unreadMessages } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const { height } = useWindowSize();

  const slideVariants: Variants = {
    hidden: {
      y: !isChatOpen ? -64 : 64,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "anticipate" },
    },
    exit: {
      y: isChatOpen ? 64 : -64,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-end p-4 z-50 !mt-0",
        isChatOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <Sheet open={isChatOpen}>
        <div className="relative z-[60]">
          <Button
            variant="primaryFancy"
            className="relative w-16 h-16 rounded-full pointer-events-auto overflow-hidden"
            onClick={() => dispatch(toggleChat())}
          >
            <AnimatePresence initial={false}>
              {isChatOpen ? (
                <XIconMotion
                  key="x-icon"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-8 h-8 absolute flex items-center justify-center"
                />
              ) : (
                <MessagesSquareIconMotion
                  key="messages-icon"
                  className="w-8 h-8 absolute flex items-center justify-center"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              )}
            </AnimatePresence>
          </Button>
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
        </div>
        <SheetOverlay onClick={() => dispatch(toggleChat())} />
        <SheetContent
          className={cn(
            "w-[calc(100%-2rem)] p-0 right-4 border-none",
            height <= 600
              ? "top-4 h-[calc(100dvh-6rem-1rem)]"
              : "top-24 h-[calc(100dvh-6rem*2)]"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
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
    </div>
  );
};

export default ChatFloat;
