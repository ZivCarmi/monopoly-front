import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn } from "@/slices/game-slice";
import Countdown from "../Countdown";
import CenterAction from "./CenterAction";
import GameLog from "./GameLog";
import { useSocket } from "@/app/socket-context2";
import StartGameButton from "../StartGameButton";
import Dices from "../Dices";
import BoardCenter from "./BoardCenter";

const CenterContent = () => {
  const socket = useSocket();
  const currentPlayerTurn = useAppSelector(selectCurrentPlayerTurn);
  const { currentPlayerTurnId, started, roomHostId } = useAppSelector(
    (state) => state.game
  );

  return (
    <BoardCenter>
      {started && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-8">
            {/* <Countdown /> */}
          </div>
          <Dices />
          {currentPlayerTurnId === socket.id ? (
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
      {!started && roomHostId === socket.id && <StartGameButton />}
      <GameLog />
    </BoardCenter>
  );
};

export default CenterContent;
