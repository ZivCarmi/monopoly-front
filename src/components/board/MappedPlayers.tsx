import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import { MappedPlayersByTiles } from "@/types/Board";
import { isPlayerInJail, mapPlayersOnBoard } from "@/utils";
import { useEffect, useState } from "react";
import PlayerButton from "./PlayerButton";
import PlayersContainer from "./PlayersContainer";

const MappedPlayers = ({ tileIndex }: { tileIndex: number }) => {
  const players = useAppSelector(selectPlayers);
  const [mappedPlayers, setMappedPlayers] = useState<MappedPlayersByTiles>({});
  const jailedPlayers = mappedPlayers[tileIndex]?.filter((player) =>
    isPlayerInJail(player.id)
  );
  const notJailedPlayers = mappedPlayers[tileIndex]?.filter(
    (player) => !isPlayerInJail(player.id)
  );

  useEffect(() => {
    setMappedPlayers(mapPlayersOnBoard());
  }, [players]);

  if (!mappedPlayers[tileIndex]) {
    return null;
  }

  return (
    <>
      {jailedPlayers.length > 0 && (
        <PlayersContainer className="prisoners">
          {jailedPlayers.map((player) => (
            <PlayerButton key={player.id} player={player} />
          ))}
        </PlayersContainer>
      )}
      {notJailedPlayers.length > 0 && (
        <PlayersContainer>
          {notJailedPlayers.map((player) => (
            <PlayerButton key={player.id} player={player} />
          ))}
        </PlayersContainer>
      )}
    </>
  );
};

export default MappedPlayers;
