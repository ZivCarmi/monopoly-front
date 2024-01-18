import BackToLobbyButton from "../game-sidebar/BackToLobbyButton";
import NewGameButton from "./NewGameButton";

const WinnerScreenActions = () => {
  return (
    <div className="space-x-2">
      <NewGameButton />
      <BackToLobbyButton />
    </div>
  );
};
export default WinnerScreenActions;
