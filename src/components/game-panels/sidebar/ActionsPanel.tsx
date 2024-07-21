import { useAppSelector } from "@/app/hooks";
import GamePanel from "../GamePanel";
import BankruptcyButton from "./BankruptcyButton";
import GamePanelContent from "../GamePanelContent";
import VotekickPlayer from "./VotekickPlayer";

const ActionsPanel = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  return (
    <GamePanel className="bg-transparent">
      <GamePanelContent className="flex justify-between">
        <BankruptcyButton />
        <VotekickPlayer />
      </GamePanelContent>
    </GamePanel>
  );
};

export default ActionsPanel;
