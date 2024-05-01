import { cn, getPlayerColor } from "@/utils";
import { HTMLMotionProps, motion } from "framer-motion";

export interface OwnerIndicatorProps extends HTMLMotionProps<"div"> {
  ownerId: string;
}

const OwnerIndicator = ({
  ownerId,
  className,
  ...props
}: OwnerIndicatorProps) => {
  const ownerColor = getPlayerColor(ownerId);

  return (
    <motion.div
      {...props}
      className={cn(
        "flex flex-[0_0_32%] items-center justify-center w-full h-full rounded-sm",
        className
      )}
      style={{ backgroundColor: ownerColor }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ ease: "circOut", duration: 0.35 }}
    />
  );
};

export default OwnerIndicator;
