import { useAppSelector } from "@/app/hooks";
import Trade from "../trade/Trade";
import BackToLobbyButton from "./BackToLobbyButton";
import BankruptcyButton from "./BankruptcyButton";

const GameSidebar = () => {
  const { started } = useAppSelector((state) => state.game);

  return (
    <div className="flex flex-col col-start-9 col-end-[16] p-4">
      <div className="bg-neutral-800 p-4 relative rounded-lg">
        <div className="flex flex-col gap-2">
          <BackToLobbyButton />
          {started && (
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
