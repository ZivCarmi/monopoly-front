import { cn } from "@/utils";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/app/hooks";
import { resetCards } from "@/slices/game-slice";
import styles from "./DrawnCardBox.module.css";

const cardClasses = {
  top: styles.top,
  right: styles.right,
  bottom: styles.bottom,
  left: styles.left,
};

type DrawnCardBoxProps = {
  row: "top" | "right" | "bottom" | "left";
  className?: string;
  children: React.ReactNode;
};

const DrawnCardBox: React.FC<DrawnCardBoxProps> = ({
  children,
  className,
  row,
}) => {
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
        "w-40 absolute rounded-md bg-violet-600 py-2 px-4 text-sm",
        className,
        cardClasses[row]
      )}
    >
      {children}
    </motion.div>
  );
};

export default DrawnCardBox;
