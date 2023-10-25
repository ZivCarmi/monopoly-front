import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context2";
import { selectPlayers } from "@/slices/game-slice";
import { setTrade } from "@/slices/trade-slice";
import { v4 as uuidv4 } from "uuid";

const SelectPlayer = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectPlayers).filter(
    (player) => player.id !== socket.id
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
        offeror: { id: socket.id, ...initialOffer },
        offeree: { id: offereeId, ...initialOffer },
      })
    );
  };

  return (
    <ul className="flex items-center justify-center flex-wrap gap-4">
      {players.map((player) => (
        <li key={player.id}>
          <button
            className="text-center text-sm"
            onClick={() => createTrade(player.id)}
          >
            <img src={`./${player.character}.png`} className="w-16" />
            {player.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SelectPlayer;
