import GamePanel from "../GamePanel";
import GamePanelContent from "../GamePanelContent";
import PanelTitle from "../PanelTitle";
import GameSettings from "./GameSettings";

const SettingsPanel = () => {
  return (
    <GamePanel>
      <PanelTitle>הגדרות משחק</PanelTitle>
      <GamePanelContent className="pt-0">
        <GameSettings />
      </GamePanelContent>
    </GamePanel>
  );
};

export default SettingsPanel;
