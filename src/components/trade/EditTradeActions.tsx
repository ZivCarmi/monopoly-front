import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { resetTrade, setMode, setTrade } from "@/slices/trade-slice";
import { isValidOffer, isValidTrade } from "@/utils";
import { useMemo } from "react";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";

const EditTradeActions = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { trade } = useAppSelector((state) => state.trade);

  if (!trade) {
    return null;
  }

  const originalTrade = useMemo(() => ({ ...trade }), []);

  const updateTradeHandler = () => {
    socket.emit("trade_update", trade);
    dispatch(resetTrade());
  };

  const backToOfferHandler = () => {
    dispatch(setMode("watching"));
    dispatch(setTrade(originalTrade));
  };

  return (
    <AlertDialogFooter>
      <Button className="ml-auto" onClick={backToOfferHandler}>
        חזור להצעה
      </Button>
      <Button
        variant="primary"
        onClick={updateTradeHandler}
        disabled={!isValidOffer(trade) || !isValidTrade(trade)}
      >
        שלח הצעה
      </Button>
    </AlertDialogFooter>
  );
};

export default EditTradeActions;
