import { PropertyPayments } from "@ziv-carmi/monopoly-utils";
import PropertyIcon from "../board/PropertyIcon";
import { TilePricingLabel, TilePricingValue } from "./TilePricing";
import TilePricingItem from "./TilePricingItem";
import TilePricingList from "./TilePricingList";

const PropertyPricing = ({ rent }: { rent: PropertyPayments }) => {
  return (
    <TilePricingList>
      {Object.values(rent).map((amount, i) => (
        <TilePricingItem key={amount}>
          <TilePricingLabel>
            {i === 0 && (
              <>
                <div className="font-medium">דמי שכירות</div>
                <div className="font-medium">בעלות על סדרה</div>
              </>
            )}
            <PropertyIcon rentIndex={i} />
          </TilePricingLabel>
          <TilePricingValue>
            <div>₪{amount}</div>
            {i === 0 && <div>₪{amount * 2}</div>}
          </TilePricingValue>
        </TilePricingItem>
      ))}
    </TilePricingList>
  );
};

export default PropertyPricing;
