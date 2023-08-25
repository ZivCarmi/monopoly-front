import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  rollDices,
  selectCurrentPlayerTurn,
  selectDices,
  switchTurn,
} from "@/slices/game-slice";
import { useEffect, useState } from "react";

const TIMES = {
  beforeRoll: 18,
  afterRoll: 45,
};

const Countdown = () => {
  const playerTurn = useAppSelector(selectCurrentPlayerTurn);
  const dices = useAppSelector(selectDices);
  const [counter, setCounter] = useState(TIMES.beforeRoll);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!playerTurn?.hasTurn) return;

    if (counter <= 0) {
      if (!playerTurn.didMove && !dices) {
        dispatch(rollDices());
      } else if (playerTurn.didMove && dices) {
        dispatch(switchTurn());
      }

      return;
    }

    const interval = setInterval(() => {
      counter && setCounter(counter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    if (!playerTurn?.hasTurn) return;

    if (!playerTurn.didMove) {
      setCounter(TIMES.beforeRoll);
    } else {
      setCounter(TIMES.afterRoll);
    }
  }, [playerTurn?.didMove]);

  // if player is moving on the board we don't show timer
  if (!playerTurn?.didMove && dices) {
    return null;
  }

  return counter > 0 && <div>זמן נותר {counter} שניות</div>;
};

export default Countdown;
