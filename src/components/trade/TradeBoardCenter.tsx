import { useAppDispatch } from "@/app/hooks";
import { setPlayerPardonCard } from "@/slices/trade-slice";
import { getPlayerPardonCards } from "@/utils";
import { PardonCard, TradePlayer } from "@ziv-carmi/monopoly-utils";
import BoardCenter from "../board-center/BoardCenter";
import PardonCardTradeItem from "./PardonCardTradeItem";

const TradeBoardCenter = ({
  trader,
  isDisabled,
}: {
  trader: TradePlayer;
  isDisabled: boolean;
}) => {
  const dispatch = useAppDispatch();
  const playerPardonCards = getPlayerPardonCards(trader.id);

  const addPardonCardHandler = (pardonCard: PardonCard) => {
    dispatch(setPlayerPardonCard({ traderId: trader.id, pardonCard }));
  };

  return (
    <BoardCenter className="min-w-[13rem] min-h-[13rem]">
      {playerPardonCards.length > 0 && (
        <div className="flex flex-col justify-center gap-4">
          {playerPardonCards.map((pardonCard) => (
            <PardonCardTradeItem
              key={pardonCard.deck}
              onClick={() => addPardonCardHandler(pardonCard)}
              hasPardonCardInDeck={trader.pardonCards.find(
                ({ deck }) => deck === pardonCard.deck
              )}
              disabled={isDisabled}
            />
          ))}
        </div>
      )}
    </BoardCenter>
  );
};

export default TradeBoardCenter;
