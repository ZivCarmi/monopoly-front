import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { isPlayerInDebt } from "@/utils";
import { Variants, motion } from "framer-motion";
import { Dices, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const buttonVariant: Variants = {
  hidden: {
    opacity: 0,
    // y: 8,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    // y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const MotionButton = motion(Button);

const RollDices = () => {
  const { cubesRolledInTurn, doublesInARow, selfPlayer } = useAppSelector(
    (state) => state.game
  );
  const hasExtraTurn = doublesInARow > 0 && doublesInARow < 3;
  const socket = useSocket();
  const isInDebt = !!selfPlayer && isPlayerInDebt(selfPlayer.id);

  const rollDiceHandler = () => {
    socket.emit("rolling_dice");
  };

  const switchTurnHandler = () => {
    socket.emit("switch_turn");
  };

  const renderButton = () => {
    if (cubesRolledInTurn && !hasExtraTurn) {
      return (
        <MotionButton
          variant="primary"
          onClick={switchTurnHandler}
          disabled={isInDebt}
          initial="hidden"
          animate="visible"
          exit="hidden"
          layout
          variants={buttonVariant}
        >
          <Icon icon={RefreshCcw} />
          סיים תור
        </MotionButton>
      );
    } else if (!cubesRolledInTurn) {
      return (
        <MotionButton
          variant="primary"
          onClick={rollDiceHandler}
          disabled={isInDebt}
          initial="hidden"
          animate="visible"
          exit="hidden"
          layout
          variants={buttonVariant}
        >
          <Icon icon={Dices} />
          הטל קוביות
        </MotionButton>
      );
    } else if (hasExtraTurn) {
      return (
        <MotionButton
          variant="blueFancy"
          onClick={rollDiceHandler}
          disabled={isInDebt}
          initial="hidden"
          animate="visible"
          exit="hidden"
          layout
          variants={buttonVariant}
        >
          <Icon icon={Dices} />
          הטל שוב
        </MotionButton>
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
