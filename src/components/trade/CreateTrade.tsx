import { useAppSelector } from "@/app/hooks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import PlayersList from "./PlayersList";
import TradeDialogCancel from "./TradeDialogCancel";

const CreateTrade = () => {
  const { selectPlayerIsOpen } = useAppSelector((state) => state.trade);

  return (
    <AlertDialog open={selectPlayerIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ביצוע עסקה</AlertDialogTitle>
          <AlertDialogDescription>
            בחר את השחקן שאיתו ברצונך לבצע עסקה
          </AlertDialogDescription>
        </AlertDialogHeader>
        <TradeDialogCancel />
        <PlayersList />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateTrade;
