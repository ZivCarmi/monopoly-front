import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import { setTrade } from "@/slices/trade-slice";
import { TradeType } from "@ziv-carmi/monopoly-utils";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import { useEffect } from "react";

const PlayersList = () => {
  const dispatch = useAppDispatch();
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  const playersExceptSelf = useAppSelector(selectPlayers).filter(
    (player) => player.id !== selfPlayer.id
  );

  const createTrade = (offereeId: string) => {
    const newTrade: TradeType = {
      id: "",
      turn: selfPlayer.id,
      traders: [
        {
          id: selfPlayer.id,
          money: 0,
          properties: [],
        },
        {
          id: offereeId,
          money: 0,
          properties: [],
        },
      ],
      createdBy: selfPlayer.id,
      lastEditBy: selfPlayer.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(setTrade(newTrade));
  };

  useEffect(() => {
    if (playersExceptSelf.length === 1) {
      createTrade(playersExceptSelf[0].id);
    }
  }, []);

  return (
    <ul className="flex items-center justify-center flex-wrap gap-4">
      {playersExceptSelf.map((player) => (
        <li key={player.id}>
          <button
            className="text-center text-sm flex items-center flex-col"
            onClick={() => createTrade(player.id)}
          >
            <PlayerCharacter character={player.character} size={64} />
            <PlayerName name={player.name} color={player.color} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PlayersList;
