import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { closeTrade } from "@/slices/trade-slice";
import { isValidTrade } from "@/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import CreateTradeActions from "./CreateTradeActions";
import EditTradeActions from "./EditTradeActions";
import TradeErrorMessage from "./TradeErrorMessage";
import TradeOffers from "./TradeOffers";
import WatchTradeActions from "./WatchTradeActions";

const Trade = () => {
  const { mode, tradeIsOpen, trade } = useAppSelector((state) => state.trade);
  const dispatch = useAppDispatch();

  if (!trade) {
    return null;
  }

  const tradeValidity = isValidTrade(trade);

  return (
    <Dialog open={tradeIsOpen}>
      <DialogPortal>
        <DialogOverlay onClick={() => dispatch(closeTrade())} />
        <DialogContent className="min-w-[500px] max-w-max">
          <DialogTitle hidden>עסקה</DialogTitle>
          <DialogDescription hidden>ביצוע עסקה</DialogDescription>
          <DialogClose onClick={() => dispatch(closeTrade())} />
          <TradeOffers />
          {!tradeValidity.valid && (
            <TradeErrorMessage validity={tradeValidity} />
          )}
          {mode === "creating" && <CreateTradeActions />}
          {mode === "watching" && <WatchTradeActions />}
          {mode === "editing" && <EditTradeActions />}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default Trade;
