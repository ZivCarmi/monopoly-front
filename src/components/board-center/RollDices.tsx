import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { isPlayerInDebt } from "@/utils";
import { Dices, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const RollDices = () => {
  const { cubesRolledInTurn, doublesInARow, selfPlayer } = useAppSelector(
    (state) => state.game
  );
  const hasExtraTurn = doublesInARow > 0 && doublesInARow < 3;
  const socket = useSocket();
  const isInDebt = !!selfPlayer && isPlayerInDebt(selfPlayer.id);

  const rollDiceHandler = () => {
    console.log("Rolling dice...");
    socket.emit("rolling_dice");
  };

  const switchTurnHandler = () => {
    socket.emit("switch_turn");
  };

  const renderButton = () => {
    if (cubesRolledInTurn && !hasExtraTurn) {
      return (
        <Button
          variant="primary"
          onClick={switchTurnHandler}
          disabled={isInDebt}
        >
          <Icon icon={RefreshCcw} />
          סיים תור
        </Button>
      );
    } else if (!cubesRolledInTurn) {
      return (
        <Button variant="primary" onClick={rollDiceHandler} disabled={isInDebt}>
          <Icon icon={Dices} />
          הטל קוביות
        </Button>
      );
    } else if (hasExtraTurn) {
      return (
        <Button
          variant="primaryFancy"
          onClick={rollDiceHandler}
          disabled={isInDebt}
        >
          <Icon icon={Dices} />
          הטל שוב
        </Button>
      );
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>{renderButton()}</span>
        </TooltipTrigger>
        {isInDebt && (
          <TooltipContent className="text-balance text-center">
            אין באפשרותך לסיים את התור כשאתה במינוס.
            <br />
            מכור נכסים או שכור עם שחקנים אחרים.
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default RollDices;
