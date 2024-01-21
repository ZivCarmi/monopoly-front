import { useSocket } from "@/app/socket-context";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constants";
import { ShoppingCart } from "lucide-react";

const PayOutOfJailButton = ({ isDisabled }: { isDisabled: boolean }) => {
  const socket = useSocket();

  const payOutOfJailHandler = () => {
    socket.emit("pay_out_of_jail");
  };

  return (
    <Button
      variant="outline"
      onClick={payOutOfJailHandler}
      disabled={isDisabled}
    >
      <Icon icon={ShoppingCart} />
      שלם ${PAY_OUT_FROM_JAIL_AMOUNT} להשתחרר מהכלא
    </Button>
  );
};

export default PayOutOfJailButton;
