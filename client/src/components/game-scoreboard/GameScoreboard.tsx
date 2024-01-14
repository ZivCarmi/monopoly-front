import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import PlayerScoreRow from "./PlayerScoreRow";

const GameScoreboard = () => {
  const players = useAppSelector(selectPlayers);

  if (players.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col col-start-2 col-end-7 h-full py-8">
      <div className="outline outline-2 outline-neutral-800 rounded-sm rtl">
        <table className="w-full text-right">
          <tbody>
            {players.map((player) => (
              <PlayerScoreRow player={player} key={player.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameScoreboard;
