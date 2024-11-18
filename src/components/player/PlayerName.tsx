import { cn } from "@/utils";

export interface PlayerNameProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

const PlayerName = ({
  name,
  children,
  className,
  ...props
}: PlayerNameProps) => {
  return (
    <span className={cn("break-all", className)} {...props}>
      {name}
      {children}
    </span>
  );
};

export default PlayerName;
