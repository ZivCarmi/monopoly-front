import { useSocket } from "@/app/socket-context";
import { NicknameSchema } from "@ziv-carmi/monopoly-utils";
import { z } from "zod";

const useUpdateNickname = () => {
  const socket = useSocket();

  const updateNicknameHandler = (nickname: z.infer<typeof NicknameSchema>) => {
    socket.emit("select_nickname", nickname);
  };

  return updateNicknameHandler;
};

export default useUpdateNickname;
