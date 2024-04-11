import { cn } from "@/utils";

interface PlayerMoneyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  money: number;
}

const PlayerMoney = ({ money, className, ...props }: PlayerMoneyProps) => {
  return (
    <p
      className={cn("inline-flex rtl:flex-row-reverse text-sm", className)}
      {...props}
    >
      ₪<span className="ltr">{money}</span>
    </p>
  );
};

export default PlayerMoney;
