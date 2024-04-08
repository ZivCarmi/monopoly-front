import { useAppSelector } from "@/app/hooks";
import useUpdateGameSetting from "@/hooks/useUpdateGameSetting";
import Setting from "./Setting";

const MaxPlayers = () => {
  const {
    settings: { maxPlayers },
  } = useAppSelector((state) => state.game);
  const updateGameSetting = useUpdateGameSetting();

  const onChangeHandler = (value: string) => {
    updateGameSetting({ maxPlayers: parseInt(value) });
  };

  return (
    <Setting
      title="מספר שחקנים"
      description="קבע כמה שחקנים יוכלו לשחק במשחק"
      settingType="select"
      options={[
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
      ]}
      value={maxPlayers.toString()}
      onValueChange={onChangeHandler}
    />
  );
};

export default MaxPlayers;
