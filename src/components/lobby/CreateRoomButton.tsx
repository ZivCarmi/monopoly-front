import { useSocket } from "@/app/socket-context";
import { Button } from "../ui/button";

const CreateRoomButton = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();

  const createRoomHandler = () => {
    socket.emit("join_room");
  };

  return (
    <Button onClick={createRoomHandler} variant="primaryFancy">
      {children}
    </Button>
  );
};

export default CreateRoomButton;
