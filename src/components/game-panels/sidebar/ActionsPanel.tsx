import { useAppSelector } from "@/app/hooks";
import GamePanel from "../GamePanel";
import BankruptcyButton from "./BankruptcyButton";
import VotekickPlayer from "./VotekickPlayer";

const ActionsPanel = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  return (
    <GamePanel className="bg-transparent">
      <div className="flex justify-between">
        <BankruptcyButton />
        <VotekickPlayer />
      </div>
    </GamePanel>
  );
};

export default ActionsPanel;
