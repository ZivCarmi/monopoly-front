import { ToggleTheme } from "@/components/theme/ThemeToggle";
import useBackToLobby from "@/hooks/useBackToLobby";
import { isSelfPlayerParticipating } from "@/utils";
import { Link } from "react-router-dom";

const InfoPanel = () => {
  const returnToLobby = useBackToLobby();

  const backToLobbyHandler = () => {
    if (!isSelfPlayerParticipating()) {
      returnToLobby();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-5xl font-bold cursor-pointer">
        <Link to="/" onClick={backToLobbyHandler}>
          מונופולי
        </Link>
      </h1>
      <ToggleTheme />
    </div>
  );
};

export default InfoPanel;
