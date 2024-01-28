import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "../ui/button";
import { setTradeStatus } from "@/slices/trade-slice";
import { useSocket } from "@/app/socket-context";
import { TradeType } from "@backend/types/Game";
import SubmitTradeButton from "./SubmitTradeButton";

const EditTrade = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { tradeId, offeror, offeree } = useAppSelector((state) => state.trade);

  if (!tradeId || !offeror || !offeree) return null;

  const updateTradeHandler = () => {
    const tradeObject: Omit<TradeType, "turn"> = {
      id: tradeId,
      offeror,
      offeree,
    };

    console.log(tradeObject);

    socket.emit("trade_update", { trade: tradeObject });

    dispatch(setTradeStatus("sent"));
  };

  const backToOfferHandler = () => {
    dispatch(setTradeStatus("recieved"));
  };

  return (
    <>
      <Button className="ml-auto" onClick={backToOfferHandler}>
        חזור להצעה
      </Button>
      <SubmitTradeButton onClick={updateTradeHandler} />
    </>
  );
};
export default EditTrade;
