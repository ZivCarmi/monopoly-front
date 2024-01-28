import { BoardRow } from "@/types/Board";
import { ReactNode } from "react";

export interface BoardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  area: BoardRow;
  children: ReactNode;
}

const BoardRow = ({ area, children, ...props }: BoardRowProps) => {
  return (
    <div {...props} className={`flex gap-1 row row_${area}`}>
      {children}
    </div>
  );
};

export default BoardRow;
