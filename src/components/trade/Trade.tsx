import { useAppSelector } from "@/app/hooks";
import { selectOffereePlayer } from "@/slices/trade-slice";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";
import CreateTradeTrigger from "./CreateTradeTrigger";
import OfferDialog from "./OfferDialog";
import SelectPlayerDialog from "./SelectPlayerDialog";

const Trade = () => {
  const { inTrade } = useAppSelector((state) => state.trade);
  const offeree = useAppSelector(selectOffereePlayer);

  return (
    <AlertDialog open={inTrade}>
      <CreateTradeTrigger />
      <AlertDialogContent className="min-w-[500px] max-w-max">
        {offeree ? (
          <OfferDialog otherPlayer={offeree} />
        ) : (
          <SelectPlayerDialog />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Trade;
