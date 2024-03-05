import { cn } from "@/utils";

interface GamePanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const GamePanel = ({ className, ...props }: GamePanelProps) => {
  return (
    <div
      {...props}
      className={cn("bg-neutral-800 p-4 rounded-lg", className)}
    />
  );
};

export default GamePanel;
