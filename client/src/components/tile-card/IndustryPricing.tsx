import { LucideIcon } from "lucide-react";

type IndustryPricingProps = {
  rent: readonly number[];
  icon: LucideIcon;
};

const IndustryPricing: React.FC<IndustryPricingProps> = ({ rent, icon }) => {
  const Icon = icon;

  return (
    <ul className="space-y-1">
      {rent.map((price, i) => (
        <li className="flex items-center justify-between" key={price}>
          <div className="text-right flex items-center gap-[2px]">
            {Array.from({ length: i + 1 }, (_, idx) => (
              <Icon key={idx} className="text-red-900" size={22} />
            ))}
          </div>
          <span>${price}</span>
        </li>
      ))}
    </ul>
  );
};

export default IndustryPricing;
