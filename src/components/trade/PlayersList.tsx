import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setMode, setTrade, setTradeIsOpen } from "@/slices/trade-slice";
import { createTrade } from "@/utils";
import PlayerName from "../player/PlayerName";
import { selectPlayersExceptSelf } from "@/app/selectors";
import PlayerCharacter from "../player/PlayerCharacter";

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
