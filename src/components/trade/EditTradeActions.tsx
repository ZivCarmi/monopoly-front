import { sanitizeTradeOnErrorThunk } from "@/actions/game-actions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { resetTrade, setMode, setTrade } from "@/slices/trade-slice";
import { isParticipatingInTrade, isValidOffer, isValidTrade } from "@/utils";
import { useEffect, useMemo } from "react";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";

const EditTradeActions = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { selfPlayer } = useAppSelector((state) => state.game);
  const { trade } = useAppSelector((state) => state.trade);
  const isParticipating =
    trade && selfPlayer && isParticipatingInTrade(trade.id, selfPlayer.id);

  if (!isParticipating) {
    return null;
  }

  const originalTrade = useMemo(() => ({ ...trade }), []);
  const tradeValidity = isValidTrade(trade);

  const updateTradeHandler = () => {
    socket.emit("trade_update", trade);
    dispatch(resetTrade());
  };

  const backToOfferHandler = () => {
    dispatch(setMode("watching"));
    dispatch(setTrade(originalTrade));
  };

  useEffect(() => {
    if (tradeValidity.valid) return;

    dispatch(sanitizeTradeOnErrorThunk(tradeValidity));
  }, [tradeValidity.valid]);

  return (
    <AlertDialogFooter>
      <Button
        variant="warning"
        className="ml-auto"
        onClick={backToOfferHandler}
      >
        חזור להצעה
      </Button>
      <Button
        variant="primary"
        onClick={updateTradeHandler}
        disabled={!isValidOffer(trade) || !isValidTrade(trade).valid}
      >
        שלח הצעה
      </Button>
    </AlertDialogFooter>
  );
};

export default EditTradeActions;
