import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleTrade } from "@/slices/trade-slice";
import { isValidTrade } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    <Dialog
      open={tradeIsOpen}
      onOpenChange={(open) => dispatch(toggleTrade(open))}
    >
      <DialogContent>
        <DialogTitle hidden>עסקה</DialogTitle>
        <DialogDescription hidden>ביצוע עסקה</DialogDescription>
        <TradeOffers />
        {!tradeValidity.valid && <TradeErrorMessage validity={tradeValidity} />}
        {mode === "creating" && <CreateTradeActions />}
        {mode === "watching" && <WatchTradeActions />}
        {mode === "editing" && <EditTradeActions />}
      </DialogContent>
    </Dialog>
  );
};

export default Trade;
