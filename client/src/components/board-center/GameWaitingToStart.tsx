import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import StartGameButton from "./StartGameButton";

const GameWaitingToStart = () => {
  const socket = useSocket();
  const { roomHostId } = useAppSelector((state) => state.game);
  const isSocketHost = roomHostId === socket.id;

  return (
    <div className="text-center min-h-12 flex items-center justify-center">
      {isSocketHost ? <StartGameButton /> : <WaitingToStartNotice />}
    </div>
  );
};

const WaitingToStartNotice = () => {
  const { roomHostId, players } = useAppSelector((state) => state.game);
  const hostPlayer = players.find((player) => player.id === roomHostId);

  return (
    <div>
      ממתין ש
      <div className="inline-flex items-center mx-2">
        {hostPlayer?.name}
        <img
          src={`/${hostPlayer?.character}.png`}
          width={32}
          className="ms-1"
        />
      </div>
      יתחיל את המשחק
    </div>
  );
};

export default GameWaitingToStart;
