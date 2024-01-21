import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { AlertDialogFooter } from "../ui/alert-dialog";
import EditTrade from "./EditTrade";
import SendTrade from "./SendTrade";
import SubmitTradeButton from "./SubmitTradeButton";
import TradeRecieved from "./TradeRecieved";

const TradeActions = () => {
  const socket = useSocket();
  const { offeror, offeree, status, isPublished } = useAppSelector(
    (state) => state.trade
  );
  const isIdle = status === "idle";
  const isSent = status === "sent";
  const isRecieved = status === "recieved";

  return (
    <AlertDialogFooter>
      {offeror?.id === socket.id && (
        <>{isIdle && <>{!isPublished ? <SendTrade /> : <EditTrade />}</>}</>
      )}
      {offeree?.id === socket.id && (
        <>{isIdle && isPublished && <EditTrade />}</>
      )}
      {isRecieved && isPublished && <TradeRecieved />}
      {isSent && <SubmitTradeButton disabled />}
    </AlertDialogFooter>
  );
};

export default TradeActions;
