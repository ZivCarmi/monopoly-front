import { useAppDispatch } from "@/app/hooks";
import { setUnreadMessages } from "@/slices/game-slice";
import { useEffect } from "react";
import ChatPanelContent from "./ChatPanelContent";

const ChatFluid = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUnreadMessages(0));

    return () => {
      dispatch(setUnreadMessages(0));
    };
  }, []);

  return <ChatPanelContent className="grow" />;
};

export default ChatFluid;
