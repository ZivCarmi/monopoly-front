import { cn } from "@/utils";
import React, { forwardRef } from "react";

interface BoardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("board ltr gap-1", className)} {...props} />
    );
  }
);

export default Board;
