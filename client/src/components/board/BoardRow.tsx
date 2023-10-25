import { cn } from "@/utils";
import styles from "./Board.module.css";

export interface BoardRowProps extends React.HTMLAttributes<HTMLUListElement> {}

const BoardRow: React.FC<BoardRowProps> = (props) => {
  return (
    <ul {...props} className={cn(styles.row, "row", props.className)}>
      {props.children}
    </ul>
  );
};

export default BoardRow;
