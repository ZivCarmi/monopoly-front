import { resetGameRoom } from "@/actions/lobby-actions";
import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { setRoom, setSelfPlayer } from "@/slices/game-slice";
import { writeLog } from "@/slices/ui-slice";
import { Player, Room } from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";

const MainLayout = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onRoomJoined = ({
    room,
    selfPlayer,
  }: {
    room: Room;
    selfPlayer?: Player;
  }) => {
    navigate(`/rooms/${room.id}`);
    dispatch(setRoom(room));
    dispatch(writeLog(`הצטרפת לחדר ${room.id}`));
    if (selfPlayer) {
      dispatch(setSelfPlayer(selfPlayer));
    }
  };

  const onRoomJoinErrorFull = () => {
    navigate("/");
    toast({
      variant: "destructive",
      title: "חדר מלא",
      description: "באפשרותך להיכנס לחדר אחר או ליצור אחד.",
    });
  };

  const onRoomJoinErrorDuplication = () => {
    navigate("/");
    toast({
      variant: "destructive",
      title: "כבר פתחת את החדר הזה בחלון אחר",
      description:
        "אם הינך רוצה להיכנס לחדר מעוד חלון, יש להיכנס מחלון גלישה בסתר.",
    });
  };

  const onRoomDeleted = () => {
    navigate("/");
    toast({
      variant: "destructive",
      title: "חדר נמחק או הסתיים",
    });
  };

  const onReturnedToLobby = () => {
    navigate("/");
    dispatch(resetGameRoom());
  };

  useEffect(() => {
    socket.on("room_joined", onRoomJoined);
    socket.on("room_join_error_full", onRoomJoinErrorFull);
    socket.on("room_join_error_duplication", onRoomJoinErrorDuplication);
    socket.on("room_deleted", onRoomDeleted);
    socket.on("on_lobby", onReturnedToLobby);

    return () => {
      socket.off("room_joined", onRoomJoined);
      socket.off("room_join_error_full", onRoomJoinErrorFull);
      socket.off("room_join_error_duplication", onRoomJoinErrorDuplication);
      socket.off("room_deleted", onRoomDeleted);
      socket.off("on_lobby", onReturnedToLobby);
    };
  });

  return <Outlet />;
};

export default MainLayout;
