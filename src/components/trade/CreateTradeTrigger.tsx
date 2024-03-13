import { HeartHandshake } from "lucide-react";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import { setInTrade } from "@/slices/trade-slice";
import { useAppDispatch } from "@/app/hooks";

const CreateTradeTrigger = () => {
  const dispatch = useAppDispatch();

  return (
    <AlertDialogTrigger asChild onClick={() => dispatch(setInTrade(true))}>
      <Button variant="primary">
        <Icon icon={HeartHandshake} />
        בצע עסקה
      </Button>
    </AlertDialogTrigger>
  );
};

export default CreateTradeTrigger;
