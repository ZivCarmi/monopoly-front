import { useAppSelector } from "@/app/hooks";
import useUpdateGameSetting from "@/hooks/useUpdateGameSetting";
import Setting from "./Setting";

const RandomizePlayerOrder = () => {
  const {
    settings: { randomizePlayerOrder },
  } = useAppSelector((state) => state.game);
  const updateGameSetting = useUpdateGameSetting();

  const onChangeHandler = () => {
    updateGameSetting({ randomizePlayerOrder: !randomizePlayerOrder });
  };

  return (
    <Setting
      title="סדר שחקנים אקראי"
      description="סדר השחקנים יסודר בצורה אקראית בתחילת המשחק"
      settingType="switch"
      checked={randomizePlayerOrder}
      onCheckedChange={onChangeHandler}
    />
  );
};

export default RandomizePlayerOrder;
