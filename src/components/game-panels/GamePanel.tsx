import { cn } from "@/utils";

interface GamePanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const GamePanel = ({ className, ...props }: GamePanelProps) => {
  return (
    <div
      {...props}
      className={cn("bg-card p-4 rounded-lg grid gap-4", className)}
    />
  );
};

export default GamePanel;
