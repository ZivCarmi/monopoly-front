import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { resetTrade } from "@/slices/trade-slice";
import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { isValidOffer } from "@/utils";

const CreateTradeActions = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { trade } = useAppSelector((state) => state.trade);

  if (!trade) {
    return null;
  }

  const sendTradeHandler = () => {
    socket.emit("trade_create", trade);
    dispatch(resetTrade());
  };

  return (
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => dispatch(resetTrade())}>
        בטל
      </AlertDialogCancel>
      <Button
        variant="primary"
        disabled={!isValidOffer(trade)}
        onClick={sendTradeHandler}
      >
        שלח עסקה
      </Button>
    </AlertDialogFooter>
  );
};

export default CreateTradeActions;
