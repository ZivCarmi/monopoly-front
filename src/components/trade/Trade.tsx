import { useAppSelector } from "@/app/hooks";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";
import CreateTradeActions from "./CreateTradeActions";
import EditTradeActions from "./EditTradeActions";
import TradeDialogCancel from "./TradeDialogCancel";
import TradeOffers from "./TradeOffers";
import WatchTradeActions from "./WatchTradeActions";
import { isValidTrade } from "@/utils";
import TradeErrorMessage from "./TradeErrorMessage";

const Trade = () => {
  const { mode, tradeIsOpen, trade } = useAppSelector((state) => state.trade);

  if (!trade) {
    return null;
  }

  const tradeValidity = isValidTrade(trade);

  return (
    <AlertDialog open={tradeIsOpen}>
      <AlertDialogContent className="min-w-[500px] max-w-max">
        <TradeDialogCancel />
        <TradeOffers />

        {!tradeValidity.valid && <TradeErrorMessage validity={tradeValidity} />}
        {mode === "creating" && <CreateTradeActions />}
        {mode === "watching" && <WatchTradeActions />}
        {mode === "editing" && <EditTradeActions />}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Trade;
