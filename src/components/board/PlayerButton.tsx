import { useAppSelector } from "@/app/hooks";
import { cn } from "@/utils";
import { Player } from "@ziv-carmi/monopoly-utils";
import PlayerCharacter from "../player/PlayerCharacter";

type PlayerButtonProps = {
  player: Player;
};

const PlayerButton = ({ player }: PlayerButtonProps) => {
  const { currentPlayerTurnId } = useAppSelector((state) => state.game);
  const isPlayerTurn = player.id === currentPlayerTurnId;

  return (
    <button
      className={cn(
        "pointer-events-auto bg-opacity-80",
        isPlayerTurn && "animate-pulse duration-1000",
        "player"
      )}
    >
      <PlayerCharacter color={player.color} />
    </button>
  );
};

export default PlayerButton;
