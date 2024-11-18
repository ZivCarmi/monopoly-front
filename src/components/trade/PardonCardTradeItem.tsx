import { cn } from "@/utils";
import { PardonCard, TradePlayer } from "@ziv-carmi/monopoly-utils";
import { ShieldCheck } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";
import Icon from "../ui/icon";

interface PardonCardTradeItemProps extends ButtonProps {
  trader: TradePlayer;
  card: PardonCard;
}

const PardonCardTradeItem = ({
  onClick,
  disabled,
  ...props
}: PardonCardTradeItemProps) => {
  return disabled ? (
    <PardonCardElement asChild {...props}>
      <div>
        <Icon icon={ShieldCheck} />
        כרטיס חנינה
      </div>
    </PardonCardElement>
  ) : (
    <PardonCardElement onClick={onClick} {...props}>
      <Icon icon={ShieldCheck} />
      כרטיס חנינה
    </PardonCardElement>
  );
};

interface PardonCardElementProps extends PardonCardTradeItemProps {}

const PardonCardElement = ({
  trader,
  card,
  className,
  ...props
}: PardonCardElementProps) => {
  const hasPardonCardInDeck = trader.pardonCards.find(
    ({ deck }) => deck === card.deck
  );

  return (
    <Button
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent outline outline-2 outline-transparent transition-all duration-300",
        hasPardonCardInDeck && "shadow-pardon-card-shadow outline-white",
        className
      )}
      {...props}
    />
  );
};

export default PardonCardTradeItem;
