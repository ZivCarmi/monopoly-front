import IsPrivate from "./IsPrivate";
import MaxPlayers from "./MaxPlayers";
import NoRentInPrison from "./NoRentInPrison";
import RandomizePlayerOrder from "./RandomizePlayerOrder";
import StartingCash from "./StartingCash";
import VacationCash from "./VacationCash";

const GameSettings = () => {
  return (
    <>
      <SettingsContainer>
        <IsPrivate />
        <StartingCash />
        <MaxPlayers />
      </SettingsContainer>
      <SettingsTitle>חוקי משחק</SettingsTitle>
      <SettingsContainer>
        <VacationCash />
        <NoRentInPrison />
        <RandomizePlayerOrder />
      </SettingsContainer>
    </>
  );
};

const SettingsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6">{children}</div>;
};

const SettingsTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="text-center text-muted-foreground border-t p-6 mt-6">
      {children}
    </h3>
  );
};

export default GameSettings;
