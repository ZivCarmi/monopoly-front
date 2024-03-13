import { useAppSelector } from "@/app/hooks";
import GameSettings from "./GameSettings";
import GameActions from "./sidebar/GameActions";
import { isGameNotStarted, isGameStarted } from "@ziv-carmi/monopoly-utils";

const GameSidebar = () => {
  const { state } = useAppSelector((state) => state.game);

  if (isGameStarted(state)) {
    return <GameActions />;
  }

  return isGameNotStarted(state) && <GameSettings />;
};

export default GameSidebar;
