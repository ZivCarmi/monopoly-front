import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getPlayerMoney } from "@/utils";
import { TradePlayer } from "@ziv-carmi/monopoly-utils";
import { Slider } from "../ui/slider";
import { setPlayerMoney } from "@/slices/trade-slice";

const MoneySlider = ({ trader }: { trader: TradePlayer }) => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.trade);
  const maxPlayerMoney = getPlayerMoney(trader.id);
  const isDisabled = mode !== "creating" && mode !== "editing";

  const setMoneyHandler = (amount: number) => {
    dispatch(setPlayerMoney({ traderId: trader.id, amount }));
  };

  return (
    <div className="mt-8">
      <Slider
        className="data-[disabled]:opacity-50"
        value={[trader.money]}
        max={maxPlayerMoney}
        step={1}
        onValueChange={(amounts) => setMoneyHandler(amounts[0])}
        disabled={isDisabled}
      />
      <div className="mt-1 text-center">${trader.money}</div>
    </div>
  );
};

export default MoneySlider;
