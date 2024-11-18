import { cn } from "@/utils";
import { ShieldCheck } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";
import Icon from "../ui/icon";
import { PardonCard } from "@ziv-carmi/monopoly-utils";

interface PardonCardTradeItemProps extends ButtonProps {
  hasPardonCardInDeck: PardonCard | undefined;
}

const PardonCardTradeItem = ({
  hasPardonCardInDeck,
  onClick,
  disabled,
  ...props
}: PardonCardTradeItemProps) => {
  return disabled ? (
    <PardonCardElement
      hasPardonCardInDeck={hasPardonCardInDeck}
      asChild
      {...props}
    >
      <div>
        <Icon icon={ShieldCheck} />
        כרטיס חנינה
      </div>
    </PardonCardElement>
  ) : (
    <PardonCardElement
      hasPardonCardInDeck={hasPardonCardInDeck}
      onClick={onClick}
      {...props}
    >
      <Icon icon={ShieldCheck} />
      כרטיס חנינה
    </PardonCardElement>
  );
};

interface PardonCardElementProps extends PardonCardTradeItemProps {}

const PardonCardElement = ({
  hasPardonCardInDeck,
  className,
  ...props
}: PardonCardElementProps) => {
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
