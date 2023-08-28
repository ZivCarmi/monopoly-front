import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/app/hooks";
import { resetCards } from "@/slices/game-slice";

const DrawnCardBox: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!children) return;

    setTimeout(() => {
      dispatch(resetCards());
    }, 5000);
  }, [children]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "w-40 absolute top-full left-[50%] translate-x-[-50%] rounded-md bg-violet-600 py-2 px-4 text-sm",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default DrawnCardBox;
