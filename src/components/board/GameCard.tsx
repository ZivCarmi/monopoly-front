import { useAppSelector } from "@/app/hooks";
import { BoardRow } from "@/types/Board";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/utils";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/app/hooks";
import { resetCards } from "@/slices/game-slice";
import { MS_FOR_CARD_MESSAGE } from "@/utils/constants";

type GameCardProps = {
  tileIndex: number;
  rowClassName: BoardRow;
};

type DrawnGameCardProps = {
  children: React.ReactNode;
  row: BoardRow;
};

const GameCard = ({ tileIndex, rowClassName }: GameCardProps) => {
  const { drawnGameCard } = useAppSelector((state) => state.game);
  return (
    <AnimatePresence>
      {drawnGameCard.card && drawnGameCard.tileIndex === tileIndex && (
        <DrawnGameCard row={rowClassName}>
          {drawnGameCard.card.message}
        </DrawnGameCard>
      )}
    </AnimatePresence>
  );
};

const DrawnGameCard: React.FC<DrawnGameCardProps> = ({ children, row }) => {
  const dispatch = useAppDispatch();
  const isYAxis = row === "top" || row === "bottom";
  const isXAxis = row === "right" || row === "left";

  useEffect(() => {
    if (!children) return;

    const timeout = setTimeout(() => {
      dispatch(resetCards());
    }, MS_FOR_CARD_MESSAGE);

    return () => {
      clearTimeout(timeout);
    };
  }, [children]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "w-40 absolute rounded-md bg-violet-600 py-2 px-4 text-sm z-10 text-right",
        isYAxis && "left-1/2 -translate-x-1/2",
        isXAxis && "top-1/2 -translate-y-1/2",
        row === "top" && "top-full",
        row === "right" && "left-full [writing-mode:initial] rotate-180",
        row === "bottom" && "bottom-full",
        row === "left" && "left-full [writing-mode:initial]"
      )}
    >
      {children}
    </motion.div>
  );
};

export default GameCard;
