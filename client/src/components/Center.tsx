import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn } from "@/slices/game-slice";
import Countdown from "./Countdown";
import CenterAction from "./CenterAction";
import GameLog from "./GameLog";
import { useSocket } from "@/app/socket-context";
import StartGameButton from "./StartGameButton";
import Dices from "./Dices";

const Center = () => {
  const { socket } = useSocket();
  const currentPlayerTurn = useAppSelector(selectCurrentPlayerTurn);
  const { currentPlayerTurnId, started, roomHostId } = useAppSelector(
    (state) => state.game
  );

  return (
    <div className="col-start-2 col-end-11 row-start-2 row-end-[11] border border-neutral-600 px-8 py-4 rtl flex flex-col">
      {started && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-8">
            {/* <Countdown /> */}
          </div>
          <Dices />
          {currentPlayerTurnId === socket?.id ? (
            <CenterAction />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <img src={`/${currentPlayerTurn?.character}.png`} width={32} />
              <h2 className="text-sm">
                <span className="font-medium">{currentPlayerTurn?.name}</span>{" "}
                משחק...
              </h2>
            </div>
          )}
        </div>
      )}
      {!started && roomHostId === socket?.id && <StartGameButton />}
      <GameLog />
    </div>
  );
};
export default Center;
