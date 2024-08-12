import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSelectPlayerIsOpen } from "@/slices/trade-slice";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import PlayersList from "./PlayersList";

const CreateTrade = () => {
  const { selectPlayerIsOpen } = useAppSelector((state) => state.trade);
  const dispatch = useAppDispatch();

  return (
    <Dialog open={selectPlayerIsOpen}>
      <DialogPortal>
        <DialogOverlay onClick={() => dispatch(setSelectPlayerIsOpen(false))} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ביצוע עסקה</DialogTitle>
            <DialogDescription>
              בחר את השחקן שאיתו ברצונך לבצע עסקה
            </DialogDescription>
          </DialogHeader>
          <DialogClose onClick={() => dispatch(setSelectPlayerIsOpen(false))} />
          <PlayersList />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateTrade;
