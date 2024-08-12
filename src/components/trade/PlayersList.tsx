import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectPlayersExceptSelf } from "@/app/selectors";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import { createTrade } from "@/slices/trade-slice";

const PlayersList = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const playersExceptSelf = useAppSelector(selectPlayersExceptSelf);
  const dispatch = useAppDispatch();

  if (!selfPlayer) {
    return null;
  }

  const selectPlayerHandler = (offereeId: string) => {
    dispatch(createTrade({ offereeId, offerorId: selfPlayer.id }));
  };

  return (
    <ul className="flex items-center justify-center flex-wrap gap-6">
      {playersExceptSelf.map((player) => (
        <li key={player.id}>
          <button
            className="text-center text-sm flex items-center flex-col"
            onClick={() => selectPlayerHandler(player.id)}
          >
            <PlayerCharacter color={player.color} />
            <PlayerName name={player.name} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PlayersList;
