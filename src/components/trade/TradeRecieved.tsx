import { setTradeStatus } from "@/slices/trade-slice";
import { Button, buttonVariants } from "../ui/button";
import { AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";

const TradeRecieved = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { tradeId } = useAppSelector((state) => state.trade);

  const declineTradeHandler = () => {
    socket.emit("trade_decline", { tradeId });
  };

  const acceptTradeHandler = () => {
    socket.emit("trade_accept", { tradeId });
  };

  const negotiateHandler = () => {
    dispatch(setTradeStatus("idle"));
  };

  return (
    <>
      <Button variant="warning" className="ml-auto" onClick={negotiateHandler}>
        ערוך הצעה
      </Button>
      <AlertDialogCancel
        className={buttonVariants({ variant: "destructive" })}
        onClick={declineTradeHandler}
      >
        סרב
      </AlertDialogCancel>
      <AlertDialogAction onClick={acceptTradeHandler}>אישור</AlertDialogAction>
    </>
  );
};

export default TradeRecieved;
