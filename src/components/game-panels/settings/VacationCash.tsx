import { useAppSelector } from "@/app/hooks";
import useUpdateGameSetting from "@/hooks/useUpdateGameSetting";
import Setting from "./Setting";

const VacationCash = () => {
  const {
    settings: { vacationCash },
  } = useAppSelector((state) => state.game);
  const updateGameSetting = useUpdateGameSetting();

  const onChangeHandler = () => {
    updateGameSetting({ vacationCash: !vacationCash });
  };

  return (
    <Setting
      title="כסף לחופשה"
      description="אם שחקן נוחת על חופשה, כל הכסף שהצטבר ממיסים ותשלומי בנק יתווספו אליו"
      settingType="switch"
      checked={vacationCash}
      onCheckedChange={onChangeHandler}
    />
  );
};

export default VacationCash;
