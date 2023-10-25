import { cn } from "@/utils";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/app/hooks";
import { resetCards } from "@/slices/game-slice";
import { BoardRow } from "@/types/Board";

type DrawnCardBoxProps = {
  children: React.ReactNode;
  row: BoardRow;
};

const DrawnCardBox: React.FC<DrawnCardBoxProps> = ({ children, row }) => {
  const dispatch = useAppDispatch();
  const isYAxis = row === "top" || row === "bottom";
  const isXAxis = row === "right" || row === "left";

  useEffect(() => {
    if (!children) return;

    const timeout = setTimeout(() => {
      dispatch(resetCards());
    }, 5000);

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
        "w-40 absolute rounded-md bg-violet-600 py-2 px-4 text-sm z-[1]",
        isYAxis && "left-1/2 -translate-x-1/2",
        isXAxis && "top-1/2 -translate-y-1/2",
        row === "top" && "top-full",
        row === "right" && "right-full",
        row === "bottom" && "bottom-full",
        row === "left" && "left-full"
      )}
    >
      {children}
    </motion.div>
  );
};

export default DrawnCardBox;
