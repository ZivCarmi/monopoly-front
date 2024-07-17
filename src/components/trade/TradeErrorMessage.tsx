import { InvalidTrade } from "@/types/Trade";
import PlayerNamePlate from "../player/PlayerNamePlate";
import PlayerName from "../player/PlayerName";
import PlayerCharacter from "../player/PlayerCharacter";
import { isPlayer } from "@/utils";

const TradeErrorMessage = ({ validity }: { validity: InvalidTrade }) => {
  const player = isPlayer(validity.error.playerId);

  return (
    <div className="text-center">
      <div className="text-destructive">עסקה זו לא יכולה להתבצע</div>
      <div className="inline-flex items-center gap-1 text-sm">
        {player && (
          <PlayerNamePlate className="mx-2">
            <PlayerCharacter color={player.color} />
            <PlayerName name={player.name} />
          </PlayerNamePlate>
        )}
        {validity.error.message}
      </div>
    </div>
  );
};

export default TradeErrorMessage;
