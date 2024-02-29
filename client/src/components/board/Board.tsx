import { cn } from "@/utils";
import React, { forwardRef, memo } from "react";

type BoardProps = {
  children: React.ReactNode;
  className?: string;
};

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children, className }, ref) => {
    return (
      <div className={cn("board ltr gap-1", className)} ref={ref}>
        {children}
      </div>
    );
  }
);

export default memo(Board);
