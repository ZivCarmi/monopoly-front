import { Button } from "./ui/button";
import { useAppDispatch } from "@/app/hooks";
import { handleRoomJoin } from "@/actions/game-actions";
import { useSocket } from "@/app/socket-context";
import { v4 as uuidv4 } from "uuid";

const CreateRoom = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  const createRoomHandler = (roomId: string) => {
    if (!socket) return;

    dispatch(handleRoomJoin(socket, roomId));
  };

  return (
    <Button
      onClick={() => createRoomHandler(uuidv4().substring(0, 5))}
      className="bg-gradient-to-tl from-green-400 to-blue-400 bg-pos-0 hover:bg-pos-100 bg-size-100-400 transition-all duration-500"
    >
      {children}
    </Button>
  );
};

export default CreateRoom;
