import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { useToast } from "@/components/ui/use-toast";
import { setRoom, setSelfPlayer, writeLog } from "@/slices/game-slice";
import { JoinRoomArgs, Player, Room } from "@ziv-carmi/monopoly-utils";
import { useNavigate } from "react-router-dom";

type JoinRoomCallbackResponse = { success: boolean } & (
  | {
      success: true;
      room: Room;
      selfPlayer?: Player;
    }
  | {
      success: false;
      roomId: string;
      reason: "room_not_available";
    }
);

const useJoinRoom = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const joinRoomHandler = (args?: JoinRoomArgs) => {
    const joinRoomCallback = (response: JoinRoomCallbackResponse) => {
      if (response.success) {
        const { room, selfPlayer } = response;
        navigate(`/rooms/${room.id}`);
        dispatch(setRoom(room));
        dispatch(writeLog(`הצטרפת לחדר ${room.id}`));
        if (selfPlayer) {
          dispatch(setSelfPlayer(selfPlayer));
        }
        return;
      }

      const { reason, roomId } = response;

      if (reason === "room_not_available") {
        navigate("/");
        toast({
          title: `חדר ${roomId} לא נמצא`,
          description: "ייתכן שהחדר נמחק או הסתיים",
          variant: "destructive",
        });
      }
    };

    socket.emit("join_room", args || null, joinRoomCallback);
  };

  return joinRoomHandler;
};

export default useJoinRoom;
