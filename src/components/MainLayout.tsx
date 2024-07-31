import { resetGameRoom } from "@/actions/lobby-actions";
import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import useBackToLobby from "@/hooks/useBackToLobby";
import useUpdateNickname from "@/hooks/useUpdateNickname";
import { setRoom, setSelfPlayer, writeLog } from "@/slices/game-slice";
import { setNickname, setUserId } from "@/slices/user-slice";
import { isInIdleRoom } from "@/utils";
import {
  PLAYER_NAME_STORAGE_KEY,
  SOUND_VOLUME_STORAGE_KEY,
} from "@/utils/constants";
import { Player, Room } from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import { Outlet, useNavigate, useNavigationType } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { setVolume } from "@/slices/ui-slice";

const STORAGED_PLAYER_NAME = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);
const STORAGED_SOUND_VOLUME = localStorage.getItem(SOUND_VOLUME_STORAGE_KEY);

const MainLayout = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const updateNickname = useUpdateNickname();
  const backToLobby = useBackToLobby();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (isInIdleRoom() && navigationType === "POP") {
      backToLobby();
    }
  }, [navigationType]);

  useEffect(() => {
    if (STORAGED_PLAYER_NAME) {
      updateNickname({ nickname: STORAGED_PLAYER_NAME });
    }

    if (STORAGED_SOUND_VOLUME) {
      dispatch(setVolume(+STORAGED_SOUND_VOLUME));
    }

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

    const onReturnedToLobby = () => {
      dispatch(resetGameRoom());
    };

    socket.on("nickname_selected", onNicknameSelected);
    socket.on("user_id", onUserId);
    socket.on("room_joined", onRoomJoined);
    socket.on("room_not_available", onRoomNotAvailable);
    socket.on("room_join_error_duplication", onRoomJoinErrorDuplication);
    socket.on("room_deleted", onRoomDeleted);
    socket.on("returned_to_lobby", onReturnedToLobby);

    return () => {
      socket.off("nickname_selected", onNicknameSelected);
      socket.off("user_id", onUserId);
      socket.off("room_joined", onRoomJoined);
      socket.off("room_not_available", onRoomNotAvailable);
      socket.off("room_join_error_duplication", onRoomJoinErrorDuplication);
      socket.off("room_deleted", onRoomDeleted);
      socket.off("returned_to_lobby", onReturnedToLobby);
    };
  }, []);

  return <Outlet />;
};

export default MainLayout;
