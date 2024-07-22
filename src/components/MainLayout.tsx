import { resetGameRoom } from "@/actions/lobby-actions";
import { playerKickedThunk } from "@/actions/socket-actions";
import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import useUpdateNickname from "@/hooks/useUpdateNickname";
import { setRoom, setSelfPlayer } from "@/slices/game-slice";
import { writeLog } from "@/slices/ui-slice";
import { setNickname, setUserId } from "@/slices/user-slice";
import { PLAYER_NAME_STORAGE_KEY } from "@/utils/constants";
import { Player, Room } from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import useBackToLobby from "@/hooks/useBackToLobby";

const STORAGED_PLAYER_NAME = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);

const MainLayout = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const updateNickname = useUpdateNickname();
  const backToLobby = useBackToLobby();

  const onNicknameSelected = (nickname: string) => {
    dispatch(setNickname(nickname));
  };

  const onUserId = (userId: string) => {
    dispatch(setUserId(userId));
  };

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

  const onRoomNotAvailable = (roomId: string) => {
    navigate("/");
    toast({
      title: `חדר ${roomId} לא נמצא`,
      description: "ייתכן שהחדר נמחק או הסתיים",
      variant: "destructive",
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

  const onReturnedToLobby = (shouldReturnToLobby: boolean) => {
    if (shouldReturnToLobby) {
      navigate("/");
    }
    dispatch(resetGameRoom());
  };

  const onPlayerKicked = (kickedPlayerId: string) => {
    const notifyOnKicked = () => {
      backToLobby();
      toast({
        variant: "destructive",
        title: "הוסרת מהמשחק על ידי מארח החדר",
      });
    };

    dispatch(playerKickedThunk(kickedPlayerId, notifyOnKicked));
  };

  useEffect(() => {
    if (STORAGED_PLAYER_NAME) {
      updateNickname({ nickname: STORAGED_PLAYER_NAME });
    }

    socket.on("nickname_selected", onNicknameSelected);
    socket.on("user_id", onUserId);
    socket.on("room_joined", onRoomJoined);
    socket.on("room_not_available", onRoomNotAvailable);
    socket.on("room_join_error_duplication", onRoomJoinErrorDuplication);
    socket.on("room_deleted", onRoomDeleted);
    socket.on("returned_to_lobby", onReturnedToLobby);
    socket.on("player_votekicked", onPlayerKicked);

    return () => {
      socket.off("nickname_selected", onNicknameSelected);
      socket.off("user_id", onUserId);
      socket.off("room_joined", onRoomJoined);
      socket.off("room_not_available", onRoomNotAvailable);
      socket.off("room_join_error_duplication", onRoomJoinErrorDuplication);
      socket.off("room_deleted", onRoomDeleted);
      socket.off("returned_to_lobby", onReturnedToLobby);
      socket.off("player_votekicked", onPlayerKicked);
    };
  }, []);

  return <Outlet />;
};

export default MainLayout;
