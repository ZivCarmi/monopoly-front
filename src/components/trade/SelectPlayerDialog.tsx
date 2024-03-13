import { useAppDispatch } from "@/app/hooks";
import { setInTrade } from "@/slices/trade-slice";
import { X } from "lucide-react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import PlayersList from "./PlayersList";

const SelectPlayerDialog = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>ביצוע עסקה</AlertDialogTitle>
        <AlertDialogDescription>
          בחר את השחקן שאיתו ברצונך לבצע עסקה
        </AlertDialogDescription>
      </AlertDialogHeader>
      <PlayersList />
      <AlertDialogCancel
        onClick={() => dispatch(setInTrade(false))}
        className="absolute left-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-0 border-none hover:bg-transparent h-auto"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </AlertDialogCancel>
    </>
  );
};

export default SelectPlayerDialog;
