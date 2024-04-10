import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import GamePanel from "../GamePanel";
import PlayerRow from "./PlayerRow";

const ScoreboardPanel = () => {
  const players = useAppSelector(selectPlayers);

  return (
    <GamePanel className="gap-0">
      {players.length > 0 ? (
        players.map((player) => <PlayerRow key={player.id} player={player} />)
      ) : (
        <div className="text-center">ממתין לשחקנים...</div>
      )}
    </GamePanel>
  );
};

export default ScoreboardPanel;
