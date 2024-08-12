import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectPlayersExceptSelf } from "@/app/selectors";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { createTrade, setSelectPlayerIsOpen } from "@/slices/trade-slice";
import { Plus } from "lucide-react";

const CreateTradeButton = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);
  const playersExceptSelf = useAppSelector(selectPlayersExceptSelf);
  const dispatch = useAppDispatch();

  if (!selfPlayer) {
    return null;
  }

  const createTradeHandler = () => {
    if (playersExceptSelf.length === 1) {
      dispatch(
        createTrade({
          offereeId: playersExceptSelf[0].id,
          offerorId: selfPlayer.id,
        })
      );
    } else {
      dispatch(setSelectPlayerIsOpen(true));
    }
  };

  return (
    <Button
      variant="primaryFancy"
      className="absolute top-1/2 left-2 -translate-y-1/2"
      onClick={createTradeHandler}
    >
      <Icon icon={Plus} />
      עסקה
    </Button>
  );
};

export default CreateTradeButton;
