import { cn } from "@/utils";
import { ReactNode } from "react";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const BoardCenter = ({ children, className, ...props }: CenterProps) => {
  return (
    <div {...props} className={cn("p-8 grid center z-0 rtl", className)}>
      {children}
    </div>
  );
};

export default BoardCenter;
