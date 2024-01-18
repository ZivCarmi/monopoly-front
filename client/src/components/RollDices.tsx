import { Button } from "./ui/button";
import { Dices, RefreshCcw } from "lucide-react";
import { useSocket } from "@/app/socket-context2";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setIsLanded } from "@/slices/game-slice";
import Icon from "./ui/icon";

const RollDices = () => {
  const dispatch = useAppDispatch();
  const { cubesRolledInTurn, doublesInARow, forceEndTurn } = useAppSelector(
    (state) => state.game
  );
  const hasExtraTurn = doublesInARow > 0 && doublesInARow < 3;
  const socket = useSocket();

  const rollDiceHandler = () => {
    if (hasExtraTurn) {
      dispatch(setIsLanded(false));
    }

    socket.emit("rolling_dice");
  };

  const switchTurnHandler = () => {
    socket.emit("switch_turn");
  };

  if (forceEndTurn || (cubesRolledInTurn && !hasExtraTurn)) {
    return (
      <Button variant="outline" onClick={switchTurnHandler}>
        <Icon icon={RefreshCcw} />
        סיים תור
      </Button>
    );
  } else if (!cubesRolledInTurn) {
    return (
      <Button variant="outline" onClick={rollDiceHandler}>
        <Icon icon={Dices} />
        הטל קוביות
      </Button>
    );
  } else if (hasExtraTurn) {
    return (
      <Button variant="rollAgain" onClick={rollDiceHandler}>
        <Icon icon={Dices} />
        הטל שוב
      </Button>
    );
  }
};

export default RollDices;
