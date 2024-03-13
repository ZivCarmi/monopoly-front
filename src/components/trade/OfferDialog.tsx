import { Player } from "@ziv-carmi/monopoly-utils";
import { AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import TradeActions from "./TradeActions";
import TradeOffers from "./TradeOffers";

const OfferDialog = ({ otherPlayer }: { otherPlayer: Player }) => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          בעסקה עם{" "}
          <span style={{ color: otherPlayer.color }}>{otherPlayer.name}</span>
        </AlertDialogTitle>
      </AlertDialogHeader>
      <TradeOffers />
      <TradeActions />
    </>
  );
};

export default OfferDialog;
