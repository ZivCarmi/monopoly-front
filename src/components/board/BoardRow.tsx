import { BoardRow as BoardRowType } from "@/types/Board";
import { ReactNode } from "react";

export interface BoardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  area: BoardRowType;
  children: ReactNode;
}

const BoardRow = ({ area, children, ...props }: BoardRowProps) => {
  return (
    <div {...props} className={`flex gap-1 row row-${area}`}>
      {children}
    </div>
  );
};

export default BoardRow;
