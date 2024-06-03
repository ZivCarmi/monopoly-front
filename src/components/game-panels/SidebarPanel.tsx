import { useAppSelector } from "@/app/hooks";
import { isGameStarted } from "@ziv-carmi/monopoly-utils";
import SettingsPanel from "./settings/SettingsPanel";
import ActionsPanel from "./sidebar/ActionsPanel";
import TradesPanel from "./trades/TradesPanel";
import MyPropertiesPanel from "./my-properties/MyPropertiesPanel";

const SidebarPanel = () => {
  const { state } = useAppSelector((state) => state.game);

  if (isGameStarted(state)) {
    return (
      <>
        <ActionsPanel />
        <TradesPanel />
        <MyPropertiesPanel />
      </>
    );
  }

  return <SettingsPanel />;
};

export default SidebarPanel;
