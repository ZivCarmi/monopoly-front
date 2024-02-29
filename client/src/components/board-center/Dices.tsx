import { useAppSelector } from "@/app/hooks";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const Dices = () => {
  const { dices } = useAppSelector((state) => state.game);

  return (
    <div className="flex justify-center">
      {dices.map((dice, i) => {
        const RolledDice = DICE_ICONS[dice - 1];
        return <RolledDice strokeWidth={1.75} size={60} key={i} />;
      })}
    </div>
  );
};

export default Dices;
