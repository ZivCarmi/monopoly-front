import { useAppDispatch } from "@/app/hooks";
import { setPlayerPardonCard } from "@/slices/trade-slice";
import { cn, getPlayerPardonCards } from "@/utils";
import {
  GameCardDeck,
  PardonCard,
  TradePlayer,
} from "@ziv-carmi/monopoly-utils";
import { ShieldCheck } from "lucide-react";
import BoardCenter from "../board-center/BoardCenter";
import { Button } from "../ui/button";
import Icon from "../ui/icon";

const TradeBoardCenter = ({
  trader,
  isDisabled,
}: {
  trader: TradePlayer;
  isDisabled: boolean;
}) => {
  const playerPardonCards = getPlayerPardonCards(trader.id);
  const dispatch = useAppDispatch();

  const addPardonCardHandler = (pardonCard: PardonCard) => {
    dispatch(setPlayerPardonCard({ traderId: trader.id, pardonCard }));
  };

  return (
    <BoardCenter className="min-w-[15rem] min-h-[15rem]">
      {playerPardonCards.length > 0 &&
        playerPardonCards.map((pardonCard) => (
          <div
            key={pardonCard.deck}
            className="flex items-center justify-center"
          >
            <Button
              disabled={isDisabled}
              variant="outline"
              className={cn(
                "bg-transparent hover:bg-transparent outline outline-2 outline-transparent transition-all",
                trader.pardonCards.find(
                  ({ deck }) => deck === pardonCard.deck
                ) && "shadow-pardon-card-shadow outline-white"
              )}
              onClick={() => addPardonCardHandler(pardonCard)}
            >
              <Icon icon={ShieldCheck} />
              כרטיס חנינה {GameCardDeck[pardonCard.deck]}
            </Button>
          </div>
        ))}
    </BoardCenter>
  );
};

export default TradeBoardCenter;
