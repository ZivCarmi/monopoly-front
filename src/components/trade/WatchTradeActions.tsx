import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { setMode } from "@/slices/trade-slice";
import { isValidTrade } from "@/utils";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";

const WatchTradeActions = () => {
  const dispatch = useAppDispatch();
  const { selfPlayer } = useAppSelector((state) => state.game);
  const socket = useSocket();
  const { trade } = useAppSelector((state) => state.trade);

  if (!trade) {
    return null;
  }

  const isDisabled = !isValidTrade(trade);

  const negotiateHandler = () => {
    dispatch(setMode("editing"));
  };

  const declineTradeHandler = () => {
    socket.emit("trade_decline", trade.id);
  };

  const acceptTradeHandler = () => {
    socket.emit("trade_accept", trade.id);
  };

  const deleteTradeHandler = () => {
    socket.emit("trade_delete", trade.id);
  };

  return (
    <AlertDialogFooter>
      {trade.turn === selfPlayer?.id ? (
        <>
          <Button
            variant="warning"
            className="ml-auto"
            onClick={negotiateHandler}
            disabled={isDisabled}
          >
            ערוך הצעה
          </Button>
          <Button
            variant="destructive"
            onClick={declineTradeHandler}
            disabled={isDisabled}
          >
            סרב
          </Button>
          <Button
            variant="primary"
            onClick={acceptTradeHandler}
            disabled={isDisabled}
          >
            אישור
          </Button>
        </>
      ) : (
        <Button variant="destructive" onClick={deleteTradeHandler}>
          מחק
        </Button>
      )}
    </AlertDialogFooter>
  );
};

export default WatchTradeActions;
