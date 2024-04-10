import { cn } from "@/utils";
import IsPrivate from "./IsPrivate";
import MaxPlayers from "./MaxPlayers";
import RandomizePlayerOrder from "./RandomizePlayerOrder";
import StartingCash from "./StartingCash";

interface GameSettings extends React.HTMLAttributes<HTMLDivElement> {}

const GameSettings = ({ className, ...props }: GameSettings) => {
  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <IsPrivate />
      <StartingCash />
      <MaxPlayers />
      <RandomizePlayerOrder />
    </div>
  );
};

export default GameSettings;
