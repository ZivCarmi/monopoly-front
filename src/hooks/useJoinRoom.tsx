import { useSocket } from "@/app/socket-context";
import { JoinRoomArgs } from "@ziv-carmi/monopoly-utils";

const useJoinRoom = () => {
  const socket = useSocket();

  const joinRoomHandler = (args?: JoinRoomArgs) => {
    socket.emit("join_room", args);
  };

  return joinRoomHandler;
};

export default useJoinRoom;
