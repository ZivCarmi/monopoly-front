import { useAppSelector } from "@/app/hooks";
import { TradeMode } from "@/slices/trade-slice";
import { AlertDialog } from "../ui/alert-dialog";
import CreateTradeActions from "./CreateTradeActions";
import EditTradeActions from "./EditTradeActions";
import TradeDialogContent from "./TradeDialogContent";
import TradeOffers from "./TradeOffers";
import WatchTradeActions from "./WatchTradeActions";
import { isParticipatingInTrade } from "@/utils";

type WithoutIdleMode = Exclude<TradeMode, "idle">;
type ActionsContent = {
  [mode in WithoutIdleMode]: JSX.Element;
};

const renderActions: ActionsContent = {
  creating: <CreateTradeActions />,
  watching: <WatchTradeActions />,
  editing: <EditTradeActions />,
};

const Trade = () => {
  const { trade, mode } = useAppSelector((state) => state.trade);
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (mode === "idle" || !trade) {
    return null;
  }

  const isTrader =
    mode === "creating" ||
    (selfPlayer && isParticipatingInTrade(trade.id, selfPlayer.id));

  return (
    <AlertDialog open={!!trade}>
      <TradeDialogContent>
        <TradeOffers trade={trade} />
        {isTrader && renderActions[mode]}
      </TradeDialogContent>
    </AlertDialog>
  );
};

export default Trade;
