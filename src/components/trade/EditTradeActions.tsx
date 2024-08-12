import { sanitizeTradeOnErrorThunk } from "@/actions/game-actions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { closeTrade, watchTrade } from "@/slices/trade-slice";
import { isParticipatingInTrade, isValidOffer, isValidTrade } from "@/utils";
import { TradeType } from "@ziv-carmi/monopoly-utils";
import { Redo2, Send } from "lucide-react";
import { useEffect, useMemo } from "react";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Icon from "../ui/icon";

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

  const originalTrade: TradeType = useMemo(() => ({ ...trade }), []);
  const tradeValidity = isValidTrade(trade);

  const updateTradeHandler = () => {
    socket.emit("trade_update", trade);
    dispatch(closeTrade());
  };

  useEffect(() => {
    if (tradeValidity.valid) return;

    dispatch(sanitizeTradeOnErrorThunk(tradeValidity));
  }, [tradeValidity.valid]);

  return (
    <AlertDialogFooter>
      <Button
        variant="yellowFancy"
        className="ml-auto"
        onClick={() => dispatch(watchTrade(originalTrade))}
      >
        <Icon icon={Redo2} />
        חזור להצעה
      </Button>
      <Button
        variant="primaryFancy"
        onClick={updateTradeHandler}
        disabled={!isValidOffer(trade) || !isValidTrade(trade).valid}
      >
        <Icon icon={Send} />
        שלח הצעה
      </Button>
    </AlertDialogFooter>
  );
};

export default EditTradeActions;
