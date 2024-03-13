import { useAppSelector } from "@/app/hooks";
import { isGameNotStarted } from "@ziv-carmi/monopoly-utils";
import CenterAction from "./CenterAction";
import Dices from "./Dices";
import GameLog from "./GameLog";
import GameWaitingToStart from "./GameWaitingToStart";

const CenterContent = () => {
  const { state } = useAppSelector((state) => state.game);

  return (
    <div className="h-5/6 self-end flex flex-col overflow-y-hidden gap-4">
      <Dices />
      <div className="flex items-center justify-center gap-2 min-h-12">
        {isGameNotStarted(state) ? <GameWaitingToStart /> : <CenterAction />}
      </div>
      <GameLog />
    </div>
  );
};

export default CenterContent;
