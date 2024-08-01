import { useSocket } from "@/app/socket-context";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@ziv-carmi/monopoly-utils";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import { buttonVariant } from "./RollDices";

const MotionButton = motion(Button);

const PayOutOfJailButton = ({ isDisabled }: { isDisabled: boolean }) => {
  const socket = useSocket();

  const payOutOfJailHandler = () => {
    socket.emit("pay_out_of_jail");
  };

  return (
    <MotionButton
      variant="blueFancy"
      onClick={payOutOfJailHandler}
      disabled={isDisabled}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      variants={buttonVariant}
    >
      <Icon icon={DollarSign} />
      השתחרר עבור ₪{PAY_OUT_FROM_JAIL_AMOUNT}
    </MotionButton>
  );
};

export default PayOutOfJailButton;
