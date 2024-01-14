import { useSocket } from "@/app/socket-context2";
import Player from "@backend/types/Player";
import { Button } from "../ui/button";
import { useAppSelector } from "@/app/hooks";
import { MoveLeft } from "lucide-react";

const PlayerScoreRow = ({ player }: { player: Player }) => {
  const { started } = useAppSelector((state) => state.game);

  return started ? (
    <PlayerRowOnGameActive player={player} />
  ) : (
    <PlayerRowOnGameIdle player={player} />
  );
};

const PlayerRowOnGameIdle = ({ player }: { player: Player }) => {
  const socket = useSocket();

  return (
    <tr className="text-center even:bg-neutral-900">
      <td className="text-right">
        <div className="flex items-center min-h-[56px] p-2">
          <div className="space-x-2 space-x-reverse">
            <img
              src={`/${player.character}.png`}
              width={32}
              className="inline-block"
            />
            <span>{player.name}</span>
          </div>
          {socket.id === player.id && (
            <Button variant="ghost" className="mx-auto text-xs">
              Change appearance
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

const PlayerRowOnGameActive = ({ player }: { player: Player }) => {
  const { currentPlayerTurnId } = useAppSelector((state) => state.game);

  return (
    <tr className="text-center even:bg-neutral-900 h-14">
      <td width="22%" className="p-2">
        {currentPlayerTurnId === player.id && (
          <MoveLeft
            className="m-auto animate-pulse"
            size={30}
            color={player.color}
          />
        )}
      </td>
      <td width="50%" className="text-right p-2">
        <div className="flex items-center space-x-2 space-x-reverse">
          <img
            src={`/${player.character}.png`}
            width={32}
            className="inline-block"
          />
          <span>{player.name}</span>
        </div>
      </td>
      <td className="text-right p-2">${player.money}</td>
    </tr>
  );
};

export default PlayerScoreRow;
