import { cn } from "@/utils";
import { HTMLAttributes } from "react";

interface OverlayProps extends HTMLAttributes<HTMLDivElement> {}

const Overlay = ({ className, ...props }: OverlayProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
};

export default Overlay;
