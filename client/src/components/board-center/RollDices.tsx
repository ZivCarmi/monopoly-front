import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { setIsLanded } from "@/slices/game-slice";
import { Dices, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";

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

    console.log("Rolling dice...");

    socket.emit("rolling_dice");
  };

  const switchTurnHandler = () => {
    socket.emit("switch_turn");
  };

  if (forceEndTurn || (cubesRolledInTurn && !hasExtraTurn)) {
    return (
      <Button variant="primary" onClick={switchTurnHandler}>
        <Icon icon={RefreshCcw} />
        סיים תור
      </Button>
    );
  } else if (!cubesRolledInTurn) {
    return (
      <Button variant="primary" onClick={rollDiceHandler}>
        <Icon icon={Dices} />
        הטל קוביות
      </Button>
    );
  } else if (hasExtraTurn) {
    return (
      <Button variant="primaryFancy" onClick={rollDiceHandler}>
        <Icon icon={Dices} />
        הטל שוב
      </Button>
    );
  }
};

export default RollDices;
