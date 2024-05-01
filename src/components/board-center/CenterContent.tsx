import { useAppSelector } from "@/app/hooks";
import { isGameNotStarted } from "@ziv-carmi/monopoly-utils";
import CenterAction from "./CenterAction";
import Dices from "./Dices";
import GameLog from "./GameLog";
import GameWaitingToStart from "./GameWaitingToStart";
import { AnimatePresence } from "framer-motion";

const CenterContent = () => {
  const { state } = useAppSelector((state) => state.game);

  return (
    <div className="h-5/6 self-end flex flex-col overflow-y-hidden gap-4">
      <Dices />
      <AnimatePresence>
        <div className="flex items-center justify-center gap-2 min-h-12">
          {isGameNotStarted(state) ? <GameWaitingToStart /> : <CenterAction />}
        </div>
      </AnimatePresence>
      <GameLog />
    </div>
  );
};

export default CenterContent;
