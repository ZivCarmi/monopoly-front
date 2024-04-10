import { useAppSelector } from "@/app/hooks";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";
import CreateTradeActions from "./CreateTradeActions";
import EditTradeActions from "./EditTradeActions";
import TradeDialogCancel from "./TradeDialogCancel";
import TradeOffers from "./TradeOffers";
import WatchTradeActions from "./WatchTradeActions";

const Trade = () => {
  const { mode, tradeIsOpen } = useAppSelector((state) => state.trade);

  return (
    <AlertDialog open={tradeIsOpen}>
      <AlertDialogContent className="min-w-[500px] max-w-max">
        <TradeDialogCancel />
        <TradeOffers />
        {mode === "creating" && <CreateTradeActions />}
        {mode === "watching" && <WatchTradeActions />}
        {mode === "editing" && <EditTradeActions />}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Trade;
