import GamePanel from "@/components/game-panels/GamePanel";
import CreateTrade from "@/components/trade/CreateTrade";
import Trade from "@/components/trade/Trade";
import PanelTitle from "../PanelTitle";
import CreateTradeButton from "./CreateTradeButton";
import GameTradesList from "./GameTradesList";

const TradesPanel = () => {
  return (
    <GamePanel>
      <div className="relative">
        <PanelTitle className="">עסקאות</PanelTitle>
        <CreateTradeButton />
      </div>
      <GameTradesList />
      <CreateTrade />
      <Trade />
    </GamePanel>
  );
};

export default TradesPanel;
