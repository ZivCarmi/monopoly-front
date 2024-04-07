import { useAppSelector } from "@/app/hooks";
import CreateTrade from "../../trade/CreateTrade";
import GamePanel from "../../ui/game-panel";
import BankruptcyButton from "./BankruptcyButton";
import PanelTitle from "../PanelTitle";

const GameActions = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  return (
    <GamePanel>
      <PanelTitle>פעולות</PanelTitle>
      <div className="flex flex-col gap-2 ">
        <BankruptcyButton />
        <CreateTrade />
      </div>
    </GamePanel>
  );
};

export default GameActions;
