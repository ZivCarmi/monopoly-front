import { useAppSelector } from "@/app/hooks";
import GameSettings from "./GameSettings";
import GameActions from "./sidebar/GameActions";

const GameSidebar = () => {
  const { started } = useAppSelector((state) => state.game);

  return started ? <GameActions /> : <GameSettings />;
};

export default GameSidebar;
