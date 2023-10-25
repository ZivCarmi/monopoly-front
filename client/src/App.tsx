import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import { useToast } from "./components/ui/use-toast";
import { handlePlayerDisconnection } from "./actions/game-actions";
import Lobby from "./components/Lobby";
import { useSocket } from "./app/socket-context2";
import GameRoom from "./components/GameRoom";

const App = () => {
  const isInRoom = useAppSelector((state) => state.game.isInRoom);
  const toastData = useAppSelector((state) => state.ui.toast);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const socket = useSocket();

  const disconnectClient = async () => {
    dispatch(handlePlayerDisconnection(socket));
  };

  useEffect(() => {
    disconnectClient();

    return () => {
      socket.off("player_left");
      socket.off("left_room");
      socket.off("on_lobby");
    };
  }, []);

  useEffect(() => {
    if (toastData) {
      toast({
        variant: toastData.variant,
        title: toastData.title,
      });
    }
  }, [toastData]);

  return (
    <div className="min-h-screen flex items-center flex-col">
      {!isInRoom && <Lobby />}
      {isInRoom && <GameRoom onDisconnection={disconnectClient} />}
    </div>
  );
};

export default App;
