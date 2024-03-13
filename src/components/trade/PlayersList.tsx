import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import { setTrade } from "@/slices/trade-slice";
import { v4 as uuidv4 } from "uuid";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";

const PlayersList = () => {
  const dispatch = useAppDispatch();
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  const players = useAppSelector(selectPlayers).filter(
    (player) => player.id !== selfPlayer.id
  );

  const createTrade = (offereeId: string) => {
    const initialOffer = {
      money: 0,
      properties: [],
    };

    dispatch(
      setTrade({
        id: uuidv4(),
        turn: offereeId,
        offeror: {
          id: selfPlayer.id,
          ...initialOffer,
        },
        offeree: {
          id: offereeId,
          ...initialOffer,
        },
      })
    );
  };

  return (
    <ul className="flex items-center justify-center flex-wrap gap-4">
      {players.map((player) => (
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
