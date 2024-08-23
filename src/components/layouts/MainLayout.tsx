import { useAppDispatch } from "@/app/hooks";
import useBackToLobby from "@/hooks/useBackToLobby";
import { setVolume } from "@/slices/ui-slice";
import { clearUser, setNickname, setUser } from "@/slices/user-slice";
import { User } from "@/types/Auth";
import { isInIdleRoom } from "@/utils";
import {
  PLAYER_NAME_STORAGE_KEY,
  SOUND_VOLUME_STORAGE_KEY,
} from "@/utils/constants";
import { useEffect } from "react";
import { Outlet, useLoaderData, useNavigationType } from "react-router-dom";

const STORAGED_PLAYER_NAME = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);
const STORAGED_SOUND_VOLUME = localStorage.getItem(SOUND_VOLUME_STORAGE_KEY);

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const backToLobby = useBackToLobby();
  const navigationType = useNavigationType();
  const userData = useLoaderData() as User | null;

  useEffect(() => {
    if (isInIdleRoom() && navigationType === "POP") {
      backToLobby();
    }
  }, [navigationType]);

  useEffect(() => {
    if (userData) {
      console.log(userData);
      dispatch(setUser(userData));
    } else {
      dispatch(clearUser());

      if (STORAGED_PLAYER_NAME) {
        dispatch(setNickname(STORAGED_PLAYER_NAME));
      }
    }

    if (STORAGED_SOUND_VOLUME) {
      dispatch(setVolume(+STORAGED_SOUND_VOLUME));
    }
  }, []);

  return <Outlet />;
};

export default MainLayout;
