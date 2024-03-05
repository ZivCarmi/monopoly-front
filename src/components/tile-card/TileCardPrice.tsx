import { LucideIcon } from "lucide-react";

type TileCardPriceProps = {
  labelAsIcon?: LucideIcon;
  labelAsText?: string;
  amount: number;
};

const TileCardPrice: React.FC<TileCardPriceProps> = ({
  labelAsIcon,
  labelAsText,
  amount,
}) => {
  const Icon = labelAsIcon;

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm">
        {Icon ? <Icon size={20} /> : labelAsText ? labelAsText : null}
      </span>
      <p>${amount}</p>
    </div>
  );
};

export default TileCardPrice;
