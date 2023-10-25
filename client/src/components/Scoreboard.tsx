import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/slices/game-slice";
import { MoveLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useSocket } from "@/app/socket-context2";

const Scoreboard = () => {
  const socket = useSocket();
  const players = useAppSelector(selectPlayers);
  const { started, currentPlayerTurnId } = useAppSelector(
    (state) => state.game
  );

  if (players.length === 0) {
    return null;
  }

  return (
    <div className="outline outline-2 outline-neutral-800 rounded-sm rtl">
      <table className="w-full text-right">
        <tbody>
          {!started &&
            players.map((player) => (
              <tr className="text-center even:bg-neutral-900" key={player.id}>
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
            ))}
          {started &&
            players.map((player) => (
              <tr
                className="text-center even:bg-neutral-900 h-14"
                key={player.id}
              >
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
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
