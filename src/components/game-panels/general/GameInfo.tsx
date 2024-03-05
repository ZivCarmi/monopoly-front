import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { ToggleTheme } from "@/components/theme/ThemeToggle";
import useBackToLobby from "@/hooks/useBackToLobby";
import { isPlayer } from "@/utils";

const GameInfo = () => {
  const socket = useSocket();
  const { started } = useAppSelector((state) => state.game);
  const backToLobby = useBackToLobby();

  const confirmBackToLobby = () => {
    if (started && isPlayer(socket.id)) {
      if (confirm("האם אתה בטוח שברצונך לחזור ללובי?")) {
        backToLobby();
      }
      return;
    }

    backToLobby();
  };

  return (
    <div className="flex items-center justify-between">
      <h1
        className="text-5xl font-bold cursor-pointer"
        onClick={confirmBackToLobby}
      >
        מונופולי
      </h1>
      <ToggleTheme />
    </div>
  );
};

export default GameInfo;
