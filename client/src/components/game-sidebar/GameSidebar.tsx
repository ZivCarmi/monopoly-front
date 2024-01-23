import { useAppSelector } from "@/app/hooks";
import Trade from "../trade/Trade";
import BackToLobbyButton from "./BackToLobbyButton";
import BankruptcyButton from "./BankruptcyButton";
import { isPlayer } from "@/utils";
import { useSocket } from "@/app/socket-context";

const GameSidebar = () => {
  const socket = useSocket();
  const { started } = useAppSelector((state) => state.game);

  return (
    <div className="flex flex-col p-4">
      <div className="bg-neutral-800 p-4 relative rounded-lg">
        <div className="flex flex-col gap-2">
          <BackToLobbyButton />
          {started && isPlayer(socket.id) && (
            <>
              <BankruptcyButton />
              <Trade />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;
