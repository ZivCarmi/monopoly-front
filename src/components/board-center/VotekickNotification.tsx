import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn } from "@/slices/game-slice";
import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import CountdownTimer from "../ui/countdown-timer";
import { useMemo } from "react";

type VotekickNotificationType = {
  selfNotify: {
    start: string;
    end: string;
  };
  othersNotify: {
    start: string;
    end: string;
  };
};

const VotekickNotification = () => {
  const currentPlayer = useAppSelector(selectCurrentPlayerTurn);

  return (
    <AnimatePresence>
      {currentPlayer?.votekickedAt && (
        <VotekickNotificationBox
          key="votekick"
          votekickAt={currentPlayer.votekickedAt}
        />
      )}
    </AnimatePresence>
  );
};

const VotekickNotificationBox = ({ votekickAt }: { votekickAt: Date }) => {
  const { selfPlayer, currentPlayerId } = useAppSelector((state) => state.game);
  const isSelfPlayerVoted = useMemo(
    () => selfPlayer?.id === currentPlayerId,
    []
  );

  let { selfNotify, othersNotify }: VotekickNotificationType = {
    selfNotify: {
      start: "תודח/י מהמשחק בעוד ",
      end: " אם לא תסיים את תורך בזמן.",
    },
    othersNotify: {
      start: "השחקן יודח מהמשחק בעוד ",
      end: " אם לא יסיים את תורו בזמן.",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute bottom-0 w-full z-10 flex items-center justify-center"
    >
      <div
        className={cn(
          "text-center rounded-full px-6 py-3 border-2 transition-colors animate-pulse",
          isSelfPlayerVoted
            ? "bg-destructive/25 border-destructive/25"
            : "bg-card/50 border-card/50"
        )}
      >
        {isSelfPlayerVoted ? selfNotify.start : othersNotify.start}
        <CountdownTimer date={votekickAt} />
        {isSelfPlayerVoted ? selfNotify.end : othersNotify.end}
      </div>
    </motion.div>
  );
};

export default VotekickNotification;
