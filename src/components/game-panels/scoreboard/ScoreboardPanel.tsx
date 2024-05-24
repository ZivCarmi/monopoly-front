import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import GamePanel from "../GamePanel";
import PlayerRow from "./PlayerRow";
import { AnimatePresence, LayoutGroup } from "framer-motion";

const ScoreboardPanel = () => {
  const players = useAppSelector(selectPlayers);

  return (
    <LayoutGroup id="scoreboard-layout">
      <GamePanel className="gap-0">
        <AnimatePresence>
          {players.length > 0 ? (
            players.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))
          ) : (
            <div className="text-center">ממתין לשחקנים...</div>
          )}
        </AnimatePresence>
      </GamePanel>
    </LayoutGroup>
  );
};

export default ScoreboardPanel;
