import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn } from "@/slices/game-slice";
import PlayerNamePlate from "../player/PlayerNamePlate";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";

const PlayerIsPlayingNotice = () => {
  const currentPlayer = useAppSelector(selectCurrentPlayerTurn);

  if (!currentPlayer) {
    return null;
  }

  return (
    <PlayerNamePlate>
      <PlayerCharacter color={currentPlayer.color} />
      <h2 className="text-sm">
        <PlayerName name={currentPlayer.name} /> משחק...
      </h2>
    </PlayerNamePlate>
  );
};

export default PlayerIsPlayingNotice;
