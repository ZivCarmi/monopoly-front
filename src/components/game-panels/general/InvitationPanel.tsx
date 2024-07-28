import { useAppSelector } from "@/app/hooks";
import { isGameStarted } from "@ziv-carmi/monopoly-utils";
import GamePanel from "../GamePanel";
import PanelTitle from "../PanelTitle";
import CopyRoomButton from "./CopyRoomButton";
import SettingsModal from "./SettingsModal";
import GamePanelContent from "../GamePanelContent";

const InvitationPanel = () => {
  const { state } = useAppSelector((state) => state.game);

  return (
    <GamePanel>
      <PanelTitle className="pb-0">שתף את המשחק</PanelTitle>
      <GamePanelContent className="flex gap-4">
        <CopyRoomButton />
        {isGameStarted(state) && <SettingsModal />}
      </GamePanelContent>
    </GamePanel>
  );
};

export default InvitationPanel;
