import IsPrivate from "./IsPrivate";
import MaxPlayers from "./MaxPlayers";
import RandomizePlayerOrder from "./RandomizePlayerOrder";
import StartingCash from "./StartingCash";

const GameSettings = () => {
  return (
    <div className="grid gap-4">
      <IsPrivate />
      <StartingCash />
      <MaxPlayers />
      <RandomizePlayerOrder />
    </div>
  );
};

export default GameSettings;
