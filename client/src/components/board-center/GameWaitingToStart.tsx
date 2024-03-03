import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import StartGameButton from "./StartGameButton";
import PlayerNamePlate from "../player/PlayerNamePlate";
import PlayerName from "../player/PlayerName";
import PlayerCharacter from "../player/PlayerCharacter";

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

  if (!hostPlayer) {
    return null;
  }

  return (
    <div>
      ממתין ל
      <PlayerNamePlate className="mx-2">
        <PlayerName name={hostPlayer.name} color={hostPlayer.color} />
        <PlayerCharacter character={hostPlayer.character} />
      </PlayerNamePlate>
      שיתחיל את המשחק
    </div>
  );
};

export default GameWaitingToStart;
