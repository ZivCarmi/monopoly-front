import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import PlayerScoreRow from "./PlayerScoreRow";

const GameScoreboard = () => {
  const players = useAppSelector(selectPlayers);

  if (players.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col col-start-9 col-end-[16] p-4">
      <div className="bg-neutral-800 p-4 relative rounded-lg">
        <div className="rtl">
          <table className="w-full text-right">
            <tbody>
              {players.map((player) => (
                <PlayerScoreRow player={player} key={player.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GameScoreboard;
