import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Slider } from "../ui/slider";
import { setPlayerMoney } from "@/slices/trade-slice";
import { InTradePlayer } from "@ziv-carmi/monopoly-utils";

type MoneySliderProps = {
  player: InTradePlayer;
};

const MoneySlider = ({ player }: MoneySliderProps) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.trade);

  const setMoneyHandler = (playerId: string, amount: number) => {
    dispatch(setPlayerMoney({ playerId, amount }));
  };

  return (
    <div className="mt-8">
      <Slider
        className="data-[disabled]:opacity-50"
        max={player.maxMoney}
        step={1}
        disabled={status === "recieved" || status === "sent"}
        value={[player.money]}
        onValueChange={(amounts) => setMoneyHandler(player.id, amounts[0])}
      />
      <div className="mt-1 text-center">${player.money}</div>
    </div>
  );
};

export default MoneySlider;
