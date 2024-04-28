import { LucideIcon } from "lucide-react";
import {
  PurchasableTileIconContainer,
  PurchasableTileIconCount,
} from "../board/PurchasableTileIcon";
import { TilePricingLabel, TilePricingValue } from "./TilePricing";
import TilePricingItem from "./TilePricingItem";
import TilePricingList from "./TilePricingList";

type IndustryPricingProps = {
  rent: readonly number[];
  icon: LucideIcon;
};

const IndustryPricing = ({ rent, icon }: IndustryPricingProps) => {
  const Icon = icon;

  return (
    <TilePricingList>
      {rent.map((price, i) => (
        <TilePricingItem key={price}>
          <TilePricingLabel>
            <PurchasableTileIconContainer>
              <Icon className="w-4 h-4" />
              <PurchasableTileIconCount rentIndex={i + 1} />
            </PurchasableTileIconContainer>
          </TilePricingLabel>
          <TilePricingValue>₪{price}</TilePricingValue>
        </TilePricingItem>
      ))}
    </TilePricingList>
  );
};

export default IndustryPricing;
