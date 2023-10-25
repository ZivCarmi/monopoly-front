import { handleDices } from "@/actions/game-actions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context2";
import { selectDices } from "@/slices/game-slice";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { useEffect } from "react";

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const Dices = () => {
  const dices = useAppSelector(selectDices);
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const onDiceRolled = ({ dices }: { dices: number[] }) => {
    console.log("Dice recieved", dices);

    dispatch(handleDices(dices, socket));
  };

  useEffect(() => {
    socket.on("dice_rolled", onDiceRolled);

    return () => {
      socket.off("dice_rolled");
    };
  }, []);

  return (
    <div className="flex justify-center mb-2">
      {dices.map((dice, i) => {
        const RolledDice = DICE_ICONS[dice - 1];
        return <RolledDice strokeWidth={1.75} size={60} key={i} />;
      })}
    </div>
  );
};

export default Dices;
