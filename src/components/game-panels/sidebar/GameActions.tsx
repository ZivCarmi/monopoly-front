import { useAppSelector } from "@/app/hooks";
import { isPlayer } from "@/utils";
import Trade from "../../trade/Trade";
import GamePanel from "../../ui/game-panel";
import BankruptcyButton from "./BankruptcyButton";

const GameActions = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (selfPlayer && !isPlayer(selfPlayer.id)) {
    return null;
  }

  return (
    <GamePanel className="flex flex-col gap-2 relative">
      <BankruptcyButton />
      <Trade />
    </GamePanel>
  );
};

export default GameActions;
