import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getPlayerMoney } from "@/utils";
import { TradePlayer } from "@ziv-carmi/monopoly-utils";
import { Slider } from "../ui/slider";
import { setPlayerMoney } from "@/slices/trade-slice";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const MoneySlider = ({ trader }: { trader: TradePlayer }) => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.trade);
  const maxPlayerMoney = getPlayerMoney(trader.id);
  const isDisabled = mode !== "creating" && mode !== "editing";

  const changeMoneyHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amount = +e.target.value;

    if (amount <= 0) {
      amount = 0;
    } else if (maxPlayerMoney && amount >= maxPlayerMoney) {
      amount = maxPlayerMoney;
    }

    dispatch(setPlayerMoney({ traderId: trader.id, amount }));
  };

  const setMoneyHandler = (amount: number) => {
    dispatch(setPlayerMoney({ traderId: trader.id, amount }));
  };

  return (
    <div className="mt-4 space-y-4">
      <Label className="relative flex items-center ltr">
        <span className="absolute top-1/2 -translate-y-1/2 left-0 w-7 flex items-center justify-center text-muted-foreground">
          ₪
        </span>
        <Input
          className="pl-6"
          type="number"
          value={Number(trader.money).toString()}
          onChange={changeMoneyHandler}
          max={maxPlayerMoney}
          disabled={isDisabled}
        />
      </Label>
      <Slider
        className="data-[disabled]:opacity-50"
        value={[trader.money]}
        max={maxPlayerMoney}
        step={1}
        onValueChange={(amounts) => setMoneyHandler(amounts[0])}
        disabled={isDisabled}
      />
      <div className="mt-1 text-center">₪{trader.money}</div>
    </div>
  );
};

export default MoneySlider;
