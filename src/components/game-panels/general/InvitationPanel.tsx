import { useAppSelector } from "@/app/hooks";
import { isGameStarted } from "@ziv-carmi/monopoly-utils";
import GamePanel from "../GamePanel";
import PanelTitle from "../PanelTitle";
import CopyRoomButton from "./CopyRoomButton";
import SettingsModal from "./SettingsModal";

const InvitationPanel = () => {
  const { state } = useAppSelector((state) => state.game);

  return (
    <GamePanel>
      <PanelTitle>שתף את המשחק</PanelTitle>
      <div className="flex gap-4">
        <CopyRoomButton />
        {isGameStarted(state) && <SettingsModal />}
      </div>
    </GamePanel>
  );
};

export default InvitationPanel;
