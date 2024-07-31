import BackToLobbyLink from "@/components/game-room/BackToLobbyLink";
import { ToggleTheme } from "@/components/theme/ThemeToggle";
import VolumeMixer from "@/components/ui/volume-mixer";

const InfoPanel = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-5xl font-bold cursor-pointer">
        <BackToLobbyLink>מונופולי</BackToLobbyLink>
      </h1>
      <div className="flex items-center gap-2">
        <ToggleTheme />
        <VolumeMixer />
      </div>
    </div>
  );
};

export default InfoPanel;
