import { useAppSelector } from "@/app/hooks";
import useUpdateGameSetting from "@/hooks/useUpdateGameSetting";
import Setting from "./Setting";

const StartingCash = () => {
  const {
    settings: { startingMoney },
  } = useAppSelector((state) => state.game);
  const updateGameSetting = useUpdateGameSetting();

  const onChangeHandler = (value: string) => {
    updateGameSetting({ startingMoney: parseInt(value) });
  };

  return (
    <Setting
      title="סכום התחלתי"
      description="קבע עם כמה כסף שחקנים יתחילו את המשחק"
      settingType="select"
      options={[
        { label: "₪500", value: "500" },
        { label: "₪1000", value: "1000" },
        { label: "₪1500", value: "1500" },
        { label: "₪2000", value: "2000" },
        { label: "₪2500", value: "2500" },
        { label: "₪3000", value: "3000" },
      ]}
      value={startingMoney.toString()}
      onValueChange={onChangeHandler}
    />
  );
};

export default StartingCash;
