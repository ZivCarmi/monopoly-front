import { Button } from "./ui/button";
import { useSocket } from "@/app/socket-context";
import { v4 as uuidv4 } from "uuid";

const CreateRoom = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();

  const createRoomHandler = () => {
    socket.emit("join_room", { roomId: uuidv4().substring(0, 5) });
  };

  return (
    <Button onClick={createRoomHandler} variant="primaryFancy">
      {children}
    </Button>
  );
};

export default CreateRoom;
