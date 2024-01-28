import { useAppSelector } from "@/app/hooks";
import { BoardRow } from "@/types/Board";
import { cn, isPlayerInJail } from "@/utils";
import Player from "@backend/types/Player";

type PlayerButtonProps = {
  player: Player;
  index: number;
  row: BoardRow;
};

const PlayerButton = ({ player, index, row }: PlayerButtonProps) => {
  const { currentPlayerTurnId } = useAppSelector((state) => state.game);
  const isPlayerTurn = player.id === currentPlayerTurnId;

  return (
    <button
      className={cn(
        "w-8 h-8 rounded-full p-[0.1rem] pointer-events-auto bg-opacity-75 absolute",
        isPlayerInJail(player.id) && "z-[-1]",
        isPlayerTurn && "animate-pulse duration-1000",
        "mapped_player"
      )}
      style={{
        backgroundColor: player.color,
        top: row === "right" ? `${0.5 + index}rem` : "",
        right: row === "bottom" ? `${0.5 + index}rem` : "",
        left: row === "top" ? `${0.5 + index}rem` : "",
        bottom: row === "left" ? `${0.5 + index}rem` : "",
        boxShadow: `0px 0px 7px 1px ${player.color}`,
      }}
    >
      <img src={`/${player.character}.png`} />
    </button>
  );
};

export default PlayerButton;
