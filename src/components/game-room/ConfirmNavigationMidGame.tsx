import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useBackToLobby from "@/hooks/useBackToLobby";
import type { unstable_Blocker as Blocker } from "react-router-dom";

const ConfirmNavigationMidGame = ({ blocker }: { blocker: Blocker }) => {
  const backToLobby = useBackToLobby(false);

  if (blocker.state === "blocked") {
    return (
      <AlertDialog defaultOpen>
        <AlertDialogContent className="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              האם אתה בטוח שברצונך לצאת מהמשחק?
            </AlertDialogTitle>
            <AlertDialogDescription>
              כל ההתקדמות במשחק שלך תאבד!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.reset?.()}>
              ביטול
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                blocker.proceed?.();
                backToLobby();
              }}
            >
              אישור
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};

export default ConfirmNavigationMidGame;
