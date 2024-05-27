import GamePanel from "../GamePanel";
import PanelTitle from "../PanelTitle";
import GameSettings from "./GameSettings";

const SettingsPanel = () => {
  return (
    <GamePanel>
      <PanelTitle>הגדרות משחק</PanelTitle>
      <GameSettings />
    </GamePanel>
  );
};

export default SettingsPanel;
