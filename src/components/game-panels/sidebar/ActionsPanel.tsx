import { useAppSelector } from "@/app/hooks";
import GamePanel from "../GamePanel";
import BankruptcyButton from "./BankruptcyButton";
import GamePanelContent from "../GamePanelContent";

const ActionsPanel = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  return (
    <GamePanel className="bg-transparent">
      <GamePanelContent className="mr-auto">
        <BankruptcyButton />
      </GamePanelContent>
    </GamePanel>
  );
};

export default ActionsPanel;
