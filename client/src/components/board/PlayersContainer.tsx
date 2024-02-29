import { cn } from "@/utils";

interface PlayersContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const PlayersContainer = ({
  className,
  children,
  ...props
}: PlayersContainerProps) => {
  return (
    <div
      {...props}
      className={cn(
        "absolute inset-0 flex items-center justify-end p-2 mapped-players pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PlayersContainer;
