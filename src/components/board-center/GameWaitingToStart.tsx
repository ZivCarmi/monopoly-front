import { useAppSelector } from "@/app/hooks";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import PlayerNamePlate from "../player/PlayerNamePlate";
import StartGameButton from "./StartGameButton";

const GameWaitingToStart = () => {
  const { hostId, selfPlayer } = useAppSelector((state) => state.game);
  const isSocketHost = hostId === selfPlayer?.id;

  return (
    <div className="text-center min-h-12 flex items-center justify-center">
      {isSocketHost ? <StartGameButton /> : <WaitingToStartNotice />}
    </div>
  );
};

const WaitingToStartNotice = () => {
  const { hostId, players } = useAppSelector((state) => state.game);
  const hostPlayer = players.find((player) => player.id === hostId);

  if (!hostPlayer) {
    return null;
  }

  return (
    <div>
      ממתין ל
      <PlayerNamePlate className="mx-2">
        <PlayerName name={hostPlayer.name} />
        <PlayerCharacter color={hostPlayer.color} />
      </PlayerNamePlate>
      שיתחיל את המשחק
    </div>
  );
};

export default GameWaitingToStart;
