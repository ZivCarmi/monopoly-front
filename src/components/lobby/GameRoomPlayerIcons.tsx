import { Player } from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";
import PlayerCharacter from "../player/PlayerCharacter";

const isPlayerType = (object: Player | JSX.Element): object is Player => {
  return (object as Player).color !== undefined;
};

type GameRoomPlayerIconsProps = {
  players: Player[];
  maxPlayers: number;
};

const GameRoomPlayerIcons = ({
  players,
  maxPlayers,
}: GameRoomPlayerIconsProps) => {
  const roomPlayers = Object.values(players);
  const roomFreeSlotsCount = maxPlayers - roomPlayers.length;
  const roomPlayersWithEmptySlots = useMemo(
    () => [
      ...roomPlayers,
      ...Array.from({ length: roomFreeSlotsCount }, () => <>&#x25cf;</>),
    ],
    [roomFreeSlotsCount]
  );

  return (
    <ul className="flex items-center gap-2">
      {roomPlayersWithEmptySlots.map((player, idx) => (
        <li key={idx}>
          {isPlayerType(player) ? (
            <PlayerCharacter color={player.color} />
          ) : (
            player
          )}
        </li>
      ))}
    </ul>
  );
};

export default GameRoomPlayerIcons;
