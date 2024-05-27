import { useAppSelector } from "@/app/hooks";
import useUpdateGameSetting from "@/hooks/useUpdateGameSetting";
import Setting from "./Setting";

const NoRentInPrison = () => {
  const {
    settings: { noRentInPrison },
  } = useAppSelector((state) => state.game);
  const updateGameSetting = useUpdateGameSetting();

  const onChangeHandler = () => {
    updateGameSetting({ noRentInPrison: !noRentInPrison });
  };

  return (
    <Setting
      title="אין תשלום שכירות בכלא"
      description="שכירות לא תגבה בעת נחיתה על נכסים שבעליהם נמצאים בכלא"
      settingType="switch"
      checked={noRentInPrison}
      onCheckedChange={onChangeHandler}
    />
  );
};

export default NoRentInPrison;
