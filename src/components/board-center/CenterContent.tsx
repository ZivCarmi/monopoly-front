import { useAppSelector } from "@/app/hooks";
import { isGameNotStarted } from "@ziv-carmi/monopoly-utils";
import CenterAction from "./CenterAction";
import Dices from "./Dices";
import GameLog from "./GameLog";
import GameWaitingToStart from "./GameWaitingToStart";
import VotekickNotification from "./VotekickNotification";

const CenterContent = () => {
  const { state } = useAppSelector((state) => state.game);

  return (
    <div className="relative h-5/6 self-end flex flex-col overflow-y-hidden gap-4">
      <Dices />
      <div className="w-1/2 mx-auto flex items-start justify-center gap-2 min-h-20 flex-wrap">
        {isGameNotStarted(state) ? <GameWaitingToStart /> : <CenterAction />}
      </div>
      <GameLog />
      <VotekickNotification />
    </div>
  );
};

export default CenterContent;
