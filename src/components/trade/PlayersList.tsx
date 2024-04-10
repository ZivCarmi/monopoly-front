import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setMode, setTrade, setTradeIsOpen } from "@/slices/trade-slice";
import { createTrade } from "@/utils";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import { selectPlayersExceptSelf } from "@/app/selectors";

const PlayersList = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const playersExceptSelf = useAppSelector(selectPlayersExceptSelf);
  const dispatch = useAppDispatch();

  if (!selfPlayer) {
    return null;
  }

  const selectPlayerHandler = (offereeId: string) => {
    const newTrade = createTrade(selfPlayer.id, offereeId);
    dispatch(setTrade(newTrade));
    dispatch(setTradeIsOpen(true));
    dispatch(setMode("creating"));
  };

  return (
    <ul className="flex items-center justify-center flex-wrap gap-4">
      {playersExceptSelf.map((player) => (
        <li key={player.id}>
          <button
            className="text-center text-sm flex items-center flex-col"
            onClick={() => selectPlayerHandler(player.id)}
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
