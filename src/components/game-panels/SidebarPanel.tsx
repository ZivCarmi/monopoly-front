import { useAppSelector } from "@/app/hooks";
import { isGameStarted } from "@ziv-carmi/monopoly-utils";
import SettingsPanel from "./settings/SettingsPanel";
import ActionsPanel from "./sidebar/ActionsPanel";
import TradesPanel from "./trades/TradesPanel";

const SidebarPanel = () => {
  const { state } = useAppSelector((state) => state.game);

  if (isGameStarted(state)) {
    return (
      <>
        <ActionsPanel />
        <TradesPanel />
      </>
    );
  }

  return <SettingsPanel />;
};

export default SidebarPanel;
