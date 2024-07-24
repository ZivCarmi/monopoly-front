import BackToLobbyLink from "@/components/game-room/BackToLobbyLink";
import { ToggleTheme } from "@/components/theme/ThemeToggle";

const InfoPanel = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-5xl font-bold cursor-pointer">
        <BackToLobbyLink>מונופולי</BackToLobbyLink>
      </h1>
      <ToggleTheme />
    </div>
  );
};

export default InfoPanel;
