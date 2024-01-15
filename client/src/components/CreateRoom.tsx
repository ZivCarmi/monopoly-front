import { Button } from "./ui/button";
import { useSocket } from "@/app/socket-context2";
import { v4 as uuidv4 } from "uuid";

const CreateRoom = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();

  const createRoomHandler = () => {
    socket.emit("join_game", { roomId: uuidv4().substring(0, 5) });
  };

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
