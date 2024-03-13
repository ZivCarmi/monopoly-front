import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import {
  resetTrade,
  setPublished,
  setTradeId,
  setTradeStatus,
} from "@/slices/trade-slice";
import { TradeType } from "@ziv-carmi/monopoly-utils";
import { AlertDialogCancel } from "../ui/alert-dialog";
import SubmitTradeButton from "./SubmitTradeButton";

const SendTrade = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const { tradeId, offeror, offeree } = useAppSelector((state) => state.trade);

  if (!tradeId || !offeror || !offeree) return null;

  const sendTradeHandler = () => {
    const tradeObject: TradeType = {
      id: tradeId,
      turn: offeree.id,
      offeror,
      offeree,
    };

    socket.emit("trade_create", tradeObject);

    dispatch(setPublished());
    dispatch(setTradeId(tradeObject.id));
    dispatch(setTradeStatus("sent"));
  };

  return (
    <>
      <AlertDialogCancel onClick={() => dispatch(resetTrade())}>
        בטל
      </AlertDialogCancel>
      <SubmitTradeButton onClick={sendTradeHandler} />
    </>
  );
};

export default SendTrade;
