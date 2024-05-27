import { Dices, X } from "lucide-react";
import PlayerMoney from "../player/PlayerMoney";
import { TilePricingItem, TilePricingList } from "./TilePricing";

type CompanyPricingProps = {
  rent: readonly number[];
};

const CompanyPricing = ({ rent }: CompanyPricingProps) => {
  return (
    <TilePricingList>
      {rent.map((price, i) => (
        <TilePricingItem className="inline-block text-center">
          אם ברשותך {i === 0 ? "חברה אחת" : `${i + 1} חברות`}
          <br />
          קבל/י&nbsp;&nbsp;
          <span className="inline-flex items-center gap-1">
            <PlayerMoney money={price} /> <X className="w-3 h-3" />
            <Dices className="w-4 h-4" />
          </span>
        </TilePricingItem>
      ))}
    </TilePricingList>
  );
};

export default CompanyPricing;
