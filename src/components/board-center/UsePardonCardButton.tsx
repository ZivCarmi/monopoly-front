import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { getPlayerPardonCards } from "@/utils";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import { buttonVariant } from "./RollDices";

const MotionButton = motion(Button);

const UsePardonCardButton = () => {
  const socket = useSocket();
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (selfPlayer && getPlayerPardonCards(selfPlayer.id).length < 1) {
    return null;
  }

  const usePardonCardHandler = () => {
    socket.emit("use_pardon_card");
  };

  return (
    <MotionButton
      className="order-1"
      variant="yellowFancy"
      onClick={usePardonCardHandler}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      variants={buttonVariant}
    >
      <Icon icon={ShieldCheck} />
      השתמש בכרטיס חנינה
    </MotionButton>
  );
};

export default UsePardonCardButton;
