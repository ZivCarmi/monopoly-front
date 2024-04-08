import { useAppSelector } from "@/app/hooks";
import GameSettings from "./settings/GameSettings";
import GameActions from "./sidebar/GameActions";
import { isGameNotStarted, isGameStarted } from "@ziv-carmi/monopoly-utils";
import GameTrades from "./trades/GameTrades";

const GameSidebar = () => {
  const { state } = useAppSelector((state) => state.game);

  if (isGameStarted(state)) {
    return (
      <>
        <GameActions />
        <GameTrades />
      </>
    );
  }

  return isGameNotStarted(state) && <GameSettings />;
};

export default GameSidebar;
