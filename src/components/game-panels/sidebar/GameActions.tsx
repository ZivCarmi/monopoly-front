import { useSocket } from "@/app/socket-context";
import { isPlayer } from "@/utils";
import Trade from "../../trade/Trade";
import GamePanel from "../../ui/game-panel";
import BankruptcyButton from "./BankruptcyButton";

const GameActions = () => {
  const socket = useSocket();

  if (!isPlayer(socket.id)) {
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
