import { cn } from "@/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GamePanelProps extends HTMLMotionProps<"div"> {}

const GamePanel = ({ className, ...props }: GamePanelProps) => {
  return (
    <motion.div
      {...props}
      className={cn("bg-card p-4 rounded-lg grid gap-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.15,
      }}
      layout
    />
  );
};

export default GamePanel;
