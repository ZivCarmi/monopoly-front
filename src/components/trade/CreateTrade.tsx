import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { HeartHandshake, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import PlayersList from "./PlayersList";
import { setMode } from "@/slices/trade-slice";

const CreateTrade = () => {
  const { mode } = useAppSelector((state) => state.trade);
  const dispatch = useAppDispatch();

  return (
    <AlertDialog
      open={mode === "creating"}
      onOpenChange={(isOpen) => dispatch(setMode(isOpen ? "creating" : "idle"))}
    >
      <AlertDialogTrigger asChild>
        <Button variant="primary">
          <Icon icon={HeartHandshake} />
          בצע עסקה
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ביצוע עסקה</AlertDialogTitle>
          <AlertDialogDescription>
            בחר את השחקן שאיתו ברצונך לבצע עסקה
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel className="absolute left-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-0 border-none hover:bg-transparent h-auto">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </AlertDialogCancel>
        <PlayersList />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateTrade;
