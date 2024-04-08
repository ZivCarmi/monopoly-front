import { useSocket } from "@/app/socket-context";
import { GameSetting } from "@ziv-carmi/monopoly-utils";

const useUpdateGameSetting = () => {
  const socket = useSocket();

  const updateGameSettingHandler = (setting: GameSetting) => {
    socket.emit("update_game_settings", setting);
  };

  return updateGameSettingHandler;
};

export default useUpdateGameSetting;
