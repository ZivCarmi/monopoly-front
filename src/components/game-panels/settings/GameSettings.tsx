import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";
import IsPrivate from "./IsPrivate";
import MaxPlayers from "./MaxPlayers";
import NoRentInPrison from "./NoRentInPrison";
import RandomizePlayerOrder from "./RandomizePlayerOrder";
import StartingCash from "./StartingCash";

interface GameSettings extends React.HTMLAttributes<HTMLDivElement> {}

const GameSettings = ({ className, ...props }: GameSettings) => {
  return (
    <div className={cn("", className)} {...props}>
      <SettingsContainer>
        <IsPrivate />
        <StartingCash />
        <MaxPlayers />
      </SettingsContainer>
      <SettingsTitle>חוקי משחק</SettingsTitle>
      <SettingsContainer>
        <NoRentInPrison />
        <RandomizePlayerOrder />
      </SettingsContainer>
    </div>
  );
};

const SettingsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4">{children}</div>;
};

const SettingsTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Separator className="mt-4" />
      <h2 className="text-center text-pretty text-muted-foreground p-4">
        {children}
      </h2>
    </>
  );
};

export default GameSettings;
