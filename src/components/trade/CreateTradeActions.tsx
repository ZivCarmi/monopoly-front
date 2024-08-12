import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { closeTrade } from "@/slices/trade-slice";
import { isValidOffer } from "@/utils";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import Icon from "../ui/icon";

const CreateTradeActions = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { trade } = useAppSelector((state) => state.trade);

  if (!trade) {
    return null;
  }

  const sendTradeHandler = () => {
    socket.emit("trade_create", trade);
    dispatch(closeTrade());
  };

  return (
    <DialogFooter>
      <Button
        variant="primaryFancy"
        disabled={!isValidOffer(trade)}
        onClick={sendTradeHandler}
      >
        <Icon icon={Send} />
        שלח עסקה
      </Button>
    </DialogFooter>
  );
};

export default CreateTradeActions;
