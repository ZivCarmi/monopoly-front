import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import { BoardRow, MappedPlayersByTiles } from "@/types/Board";
import { mapPlayersOnBoard } from "@/utils";
import { useEffect, useState } from "react";
import PlayerButton from "./PlayerButton";

type MappedPlayersProps = {
  tileIndex: number;
  rowClassName: BoardRow;
};

const MappedPlayers = ({ tileIndex, rowClassName }: MappedPlayersProps) => {
  const players = useAppSelector(selectPlayers);
  const [mappedPlayers, setMappedPlayers] = useState<MappedPlayersByTiles>({});

  // console.log(tileIndex);

  useEffect(() => {
    setMappedPlayers(mapPlayersOnBoard());
  }, [players]);

  return mappedPlayers[tileIndex]?.map((player, idx) => (
    <PlayerButton
      key={player.id}
      player={player}
      index={idx}
      row={rowClassName}
    />
  ));
};

export default MappedPlayers;
