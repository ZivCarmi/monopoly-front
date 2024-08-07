import { useAppSelector } from "@/app/hooks";
import { cn } from "@/utils";
import { Player } from "@ziv-carmi/monopoly-utils";
import PlayerCharacter from "../player/PlayerCharacter";

const PlayerButton = ({ player }: { player: Player }) => {
  const { currentPlayerId } = useAppSelector((state) => state.game);
  const isPlayerTurn = player.id === currentPlayerId;

  return (
    <button
      className={cn(
        "pointer-events-auto bg-opacity-80 player",
        isPlayerTurn && "animate-pulse duration-700"
      )}
    >
      <PlayerCharacter
        color={player.color}
        className={isPlayerTurn ? "scale-125" : ""}
        style={{
          filter:
            "drop-shadow(0 0 0.5em black) drop-shadow(0 0 .75em rgba(0,0,0,0.25))",
        }}
      />
    </button>
  );
};

export default PlayerButton;
