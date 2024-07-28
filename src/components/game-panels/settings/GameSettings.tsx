import { Separator } from "@/components/ui/separator";
import GamePanelContent from "../GamePanelContent";
import PanelTitle from "../PanelTitle";
import IsPrivate from "./IsPrivate";
import MaxPlayers from "./MaxPlayers";
import NoRentInPrison from "./NoRentInPrison";
import RandomizePlayerOrder from "./RandomizePlayerOrder";
import StartingCash from "./StartingCash";

interface GameSettings extends React.HTMLAttributes<HTMLDivElement> {}

const GameSettings = ({ ...props }: GameSettings) => {
  return (
    <div {...props}>
      <PanelTitle className="pb-0">הגדרות משחק</PanelTitle>
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
  return <GamePanelContent className="space-y-4">{children}</GamePanelContent>;
};

const SettingsTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Separator />
      <PanelTitle className="pb-0">{children}</PanelTitle>
    </>
  );
};

export default GameSettings;
