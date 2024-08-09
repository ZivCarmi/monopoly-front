import { cn } from "@/utils";
import { HTMLMotionProps, motion, Variants } from "framer-motion";
import Overlay from "./overlay";

interface ModalProps extends HTMLMotionProps<"div"> {}

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
};

const Modal = ({ className, children, ...props }: ModalProps) => {
  return (
    <>
      <Overlay />
      <motion.div
        className={cn(
          "absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 text-center",
          className
        )}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export default Modal;
