import { PropertyPayments } from "@ziv-carmi/monopoly-utils";
import PropertyIcon from "../board/PropertyIcon";
import {
  TilePricingLabel,
  TilePricingValue,
  TilePricingItem,
  TilePricingList,
  TilePricingInstructions,
} from "./TilePricing";

const PropertyPricing = ({ rent }: { rent: PropertyPayments }) => {
  return (
    <TilePricingList>
      <TilePricingInstructions />
      {Object.values(rent).map((amount, i) => (
        <TilePricingItem key={amount}>
          <TilePricingLabel>
            {i === 0 && (
              <>
                <div className="font-medium">שכירות</div>
                <div className="font-medium mt-2">בעלות על סדרה</div>
              </>
            )}
            <PropertyIcon rentIndex={i} />
          </TilePricingLabel>
          <TilePricingValue>
            <div>₪{amount}</div>
            {i === 0 && <div className="mt-2">₪{amount * 2}</div>}
          </TilePricingValue>
        </TilePricingItem>
      ))}
    </TilePricingList>
  );
};

export default PropertyPricing;
