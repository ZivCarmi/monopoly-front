import { ButtonWithIcon } from "./ui/button";
import { Dices, RefreshCcw } from "lucide-react";
import { useSocket } from "@/app/socket-context";
import { useAppSelector } from "@/app/hooks";

const RollDices = () => {
  const { cubesRolledInTurn, doublesInARow, forceEndTurn } = useAppSelector(
    (state) => state.game
  );
  const hasExtraTurn = doublesInARow > 0 && doublesInARow < 3;
  const { socket } = useSocket();

  if (!socket) {
    return null;
  }

  const rollDiceHandler = () => {
    socket.emit("rolling_dice");
  };

  const switchTurnHandler = () => {
    socket.emit("switch_turn");
  };

  if (forceEndTurn || (cubesRolledInTurn && !hasExtraTurn)) {
    return (
      <ButtonWithIcon
        icon={RefreshCcw}
        children="סיים תור"
        variant="outline"
        onClick={switchTurnHandler}
      />
    );
  } else if (!cubesRolledInTurn) {
    return (
      <ButtonWithIcon
        icon={Dices}
        children="הטל קוביות"
        variant="outline"
        onClick={rollDiceHandler}
      />
    );
  } else if (hasExtraTurn) {
    return (
      <ButtonWithIcon
        icon={Dices}
        children="הטל שוב"
        variant="rollAgain"
        onClick={rollDiceHandler}
      />
    );
  }
};

export default RollDices;
