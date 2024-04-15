import { cn } from "@/utils";

export interface PlayerNameProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

const PlayerName = ({ name, className, ...props }: PlayerNameProps) => {
  return (
    <span className={cn("break-all", className)} {...props}>
      {name}
    </span>
  );
};

export default PlayerName;
