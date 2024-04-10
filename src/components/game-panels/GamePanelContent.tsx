import { cn } from "@/utils";

interface GamePanelContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const GamePanelContent = ({ className, ...props }: GamePanelContentProps) => {
  return <div {...props} className={cn("relative", className)} />;
};

export default GamePanelContent;
