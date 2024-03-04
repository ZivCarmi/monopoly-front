import { useAppSelector } from "@/app/hooks";
import { Button, buttonVariants } from "../ui/button";
import { TradeStatus } from "@ziv-carmi/monopoly-utils";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

type ButtonStatus = {
  [key in TradeStatus]: string;
};

export const buttonStatus: ButtonStatus = {
  idle: "שלח עסקה",
  sent: "ממתין למענה...",
  recieved: "אישור",
};

export interface SubmitTradeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  onClick?: () => void;
}

const SubmitTradeButton: React.FC<SubmitTradeButtonProps> = ({
  className,
  variant = "primary",
  size,
  onClick,
  ...props
}) => {
  const { offeror, offeree, status } = useAppSelector((state) => state.trade);
  const players = [offeror, offeree];
  const isAnOffer = players.some((player) => {
    if (player?.money && player?.money > 0) {
      return true;
    }

    if (player?.properties && player.properties.length > 0) {
      return true;
    }

    return false;
  });

  return (
    <Button
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={onClick}
      disabled={!isAnOffer || props.disabled}
      {...props}
    >
      {buttonStatus[status]}
    </Button>
  );
};

export default SubmitTradeButton;
