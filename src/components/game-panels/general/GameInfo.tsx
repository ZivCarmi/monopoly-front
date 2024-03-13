import { useAppSelector } from "@/app/hooks";
import { ToggleTheme } from "@/components/theme/ThemeToggle";
import useBackToLobby from "@/hooks/useBackToLobby";
import { isPlayer } from "@/utils";
import { isGameStarted } from "@ziv-carmi/monopoly-utils";

const GameInfo = () => {
  const { state, selfPlayer } = useAppSelector((state) => state.game);
  const backToLobby = useBackToLobby();

  const confirmBackToLobby = () => {
    if (isGameStarted(state) && selfPlayer && isPlayer(selfPlayer.id)) {
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
