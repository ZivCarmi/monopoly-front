import { Button } from "./ui/button";
import { useAppDispatch } from "@/app/hooks";
import { handleRoomJoin } from "@/actions/game-actions";
import { useSocket } from "@/app/socket-context2";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { setRoom } from "@/slices/game-slice";
import { setRoomUi, showToast } from "@/slices/ui-slice";
import Room from "@backend/classes/Room";
import { useNavigate } from "react-router-dom";

const CreateRoom = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const createRoomHandler = () => {
    dispatch(handleRoomJoin(socket, uuidv4().substring(0, 5)));
  };

  const onRoomJoined = ({ room }: { room: Room }) => {
    dispatch(setRoom(room));
    dispatch(setRoomUi(room.logs));
    navigate(`/room/${room.id}`);
  };

  const onRoomJoinFail = ({ error }: { error: string }) => {
    dispatch(
      showToast({
        variant: "destructive",
        title: error,
      })
    );
  };

  useEffect(() => {
    socket.on("room_joined", onRoomJoined);
    socket.on("room_join_error", onRoomJoinFail);

    return () => {
      socket.off("room_joined", onRoomJoined);
      socket.off("room_join_error", onRoomJoinFail);
    };
  }, []);

  return (
    <Button
      onClick={createRoomHandler}
      className="bg-gradient-to-tl from-green-400 to-blue-400 bg-pos-0 hover:bg-pos-100 bg-size-100-400 transition-all duration-500"
    >
      {children}
    </Button>
  );
};

export default CreateRoom;
