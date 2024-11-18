import { useAppSelector } from "@/app/hooks";
import {
  getPlayerPardonCards,
  getPlayerPurchasables,
  hasBuildings,
} from "@/utils";
import { isProperty, TradePlayer } from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";
import PardonCardTradeItem from "./PardonCardTradeItem";
import PurchasableTradeItem from "./PurchasableTradeItem";

const TradeBoardList = ({ trader }: { trader: TradePlayer }) => {
  const { mode } = useAppSelector((state) => state.trade);
  const isDisabled = mode !== "creating" && mode !== "editing";
  const playerPardonCards = useMemo(() => getPlayerPardonCards(trader.id), []);
  const playerPurchasables = useMemo(
    () => getPlayerPurchasables(trader.id, true),
    []
  );

  return (
    <ScrollArea className="h-52 grow" scrollHideDelay={2000} dir="rtl">
      <div className="flex flex-col justify-center gap-2">
        {playerPurchasables.map((purchasable) => (
          <PurchasableTradeItem
            key={purchasable.index}
            className="w-full h-auto flex-wrap whitespace-normal text-right"
            trader={trader}
            purchasable={purchasable}
            disabled={
              isDisabled ||
              (isProperty(purchasable.tile) &&
                hasBuildings(purchasable.tile.country.id))
            }
          />
        ))}
        {playerPardonCards.map((pardonCard) => (
          <PardonCardTradeItem
            className="justify-start"
            key={pardonCard.deck}
            trader={trader}
            card={pardonCard}
            disabled={isDisabled}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TradeBoardList;
