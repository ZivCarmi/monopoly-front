import { cn } from "@/utils";
import Overlay from "./overlay";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {}

const Modal = ({ className, children, ...props }: ModalProps) => {
  return (
    <>
      <Overlay />
      <div
        className={cn(
          "absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 text-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
