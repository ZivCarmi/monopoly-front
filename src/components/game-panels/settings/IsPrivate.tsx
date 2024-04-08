import { useAppSelector } from "@/app/hooks";
import useUpdateGameSetting from "@/hooks/useUpdateGameSetting";
import Setting from "./Setting";

const IsPrivate = () => {
  const {
    settings: { isPrivate },
  } = useAppSelector((state) => state.game);
  const updateGameSetting = useUpdateGameSetting();

  const onChangeHandler = () => {
    updateGameSetting({ isPrivate: !isPrivate });
  };

  return (
    <Setting
      title="חדר פרטי"
      description="חדרים פרטיים יכולים להיות נגישים אך ורק דרך קישור URL של החדר"
      settingType="switch"
      checked={isPrivate}
      onCheckedChange={onChangeHandler}
    />
  );
};

export default IsPrivate;
