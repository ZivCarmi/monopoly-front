import { useAppSelector } from "@/app/hooks";
import { cn } from "@/utils";
import { Player } from "@ziv-carmi/monopoly-utils";

type PlayerButtonProps = {
  player: Player;
};

const PlayerButton = ({ player }: PlayerButtonProps) => {
  const { currentPlayerTurnId } = useAppSelector((state) => state.game);
  const isPlayerTurn = player.id === currentPlayerTurnId;

  return (
    <button
      className={cn(
        "w-8 h-8 rounded-full p-[0.1rem] pointer-events-auto bg-opacity-75",
        isPlayerTurn && "animate-pulse duration-1000",
        "player"
      )}
      style={{
        backgroundColor: player.color,
        boxShadow: `0px 0px 7px 1px ${player.color}`,
      }}
    >
      <img src={`/${player.character}.png`} />
    </button>
  );
};

export default PlayerButton;
