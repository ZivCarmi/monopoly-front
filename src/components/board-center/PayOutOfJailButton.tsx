import { useSocket } from "@/app/socket-context";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@ziv-carmi/monopoly-utils";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const PayOutOfJailButton = ({ isDisabled }: { isDisabled: boolean }) => {
  const socket = useSocket();

  const payOutOfJailHandler = () => {
    socket.emit("pay_out_of_jail");
  };

  return (
    <MotionButton
      variant="outline"
      onClick={payOutOfJailHandler}
      disabled={isDisabled}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      viewport={{ once: true }}
    >
      <Icon icon={ShoppingCart} />
      שלם ₪{PAY_OUT_FROM_JAIL_AMOUNT} להשתחרר מהכלא
    </MotionButton>
  );
};

export default PayOutOfJailButton;
