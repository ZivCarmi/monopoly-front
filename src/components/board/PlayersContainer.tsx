import { cn } from "@/utils";

interface PlayersContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const PlayersContainer = ({ className, ...props }: PlayersContainerProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-end p-2 mapped-players pointer-events-none",
        className
      )}
      {...props}
    />
  );
};

export default PlayersContainer;
