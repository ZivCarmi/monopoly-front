import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context2";
import { resetRoom, setRoom } from "@/slices/game-slice";
import { resetUi, setRoomUi } from "@/slices/ui-slice";
import Room from "@backend/classes/Room";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

const MainLayout = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onRoomJoined = ({ room }: { room: Room }) => {
    dispatch(setRoom(room));
    dispatch(setRoomUi(room.logs));
    navigate(`/rooms/${room.id}`);
  };

  const onRoomJoinError = ({ error }: { error: string }) => {
    toast({
      variant: "destructive",
      title: error,
    });
  };

  const onRoomDeleted = () => {
    navigate("/");
    toast({
      variant: "destructive",
      title: "Room was deleted due to no active players",
    });
  };

  const onReturnedToLobby = () => {
    dispatch(resetRoom());
    dispatch(resetUi());
  };

  useEffect(() => {
    socket.on("room_joined", onRoomJoined);
    socket.on("room_join_error", onRoomJoinError);
    socket.on("room_deleted", onRoomDeleted);
    socket.on("on_lobby", onReturnedToLobby);

    return () => {
      socket.off("room_joined", onRoomJoined);
      socket.off("room_join_error", onRoomJoinError);
      socket.on("room_deleted", onRoomDeleted);
      socket.off("on_lobby", onReturnedToLobby);
    };
  });

  return <Outlet />;
};

export default MainLayout;
