import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { editTrade } from "@/slices/trade-slice";
import { isParticipatingInTrade, isValidTrade } from "@/utils";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import Icon from "../ui/icon";

const WatchTradeActions = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { selfPlayer } = useAppSelector((state) => state.game);
  const { trade } = useAppSelector((state) => state.trade);
  const isParticipating =
    trade && selfPlayer && isParticipatingInTrade(trade.id, selfPlayer.id);

  if (!isParticipating) {
    return null;
  }

  const isDisabled = !isValidTrade(trade).valid;

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
    <DialogFooter>
      {trade.turn === selfPlayer?.id ? (
        <>
          <Button variant="yellowFancy" onClick={() => dispatch(editTrade())}>
            <Icon icon={Pencil} />
            התמקח
          </Button>
          <Button variant="redFancy" onClick={declineTradeHandler}>
            <Icon icon={X} />
            סרב
          </Button>
          <Button
            variant="primaryFancy"
            onClick={acceptTradeHandler}
            disabled={isDisabled}
          >
            <Icon icon={Check} />
            אשר
          </Button>
        </>
      ) : (
        <Button variant="redFancy" onClick={deleteTradeHandler}>
          <Icon icon={X} />
          מחק עסקה
        </Button>
      )}
    </DialogFooter>
  );
};

export default WatchTradeActions;
