import GamePanel from "@/components/game-panels/GamePanel";
import CreateTrade from "@/components/trade/CreateTrade";
import Trade from "@/components/trade/Trade";
import GamePanelContent from "../GamePanelContent";
import PanelTitle from "../PanelTitle";
import CreateTradeButton from "./CreateTradeButton";
import GameTrades from "./GameTrades";

const TradesPanel = () => {
  return (
    <GamePanel>
      <GamePanelContent>
        <PanelTitle>Trades</PanelTitle>
        <CreateTradeButton />
        <GameTrades />
      </GamePanelContent>
      <CreateTrade />
      <Trade />
    </GamePanel>
  );
};

export default TradesPanel;
