import { useAppSelector } from "@/app/hooks";
import { getPlayerColor } from "@/utils";
import {
  hasBuildings,
  hasMonopoly,
  IProperty,
} from "@ziv-carmi/monopoly-utils";
import PropertyIcon from "../board/PropertyIcon";
import {
  TilePricingInstructions,
  TilePricingItem,
  TilePricingLabel,
  TilePricingList,
  TilePricingValue,
} from "./TilePricing";
import { useMemo } from "react";

const PropertyPricing = ({ property }: { property: IProperty }) => {
  const {
    map: { board },
  } = useAppSelector((state) => state.game);
  const rents = useMemo(() => {
    const normalRents = [...Object.values(property.rent)];

    normalRents.splice(1, 0, normalRents[0] * 2);

    return normalRents;
  }, []);

  const ownerColor = property.owner && getPlayerColor(property.owner);
  const isBuilt = hasBuildings(board, property.country.id);
  const isMonopolied = hasMonopoly(board, property.country.id);

  return (
    <TilePricingList>
      <TilePricingInstructions />
      {rents.map((amount, i) => {
        const indicateIndex = isMonopolied
          ? isBuilt
            ? property.rentIndex + 1 // we add one because double price takes place in "rents" array at index 1
            : 1
          : 0;

        return (
          <TilePricingItem
            key={amount}
            style={{
              backgroundColor:
                ownerColor && indicateIndex === i ? ownerColor : "",
            }}
          >
            <TilePricingLabel>
              {i === 0 && <div className="font-medium">שכירות</div>}
              {i === 1 && <div className="font-medium">בעלות על סדרה</div>}
              {i >= 2 && i <= 7 && <PropertyIcon rentIndex={i - 1} />}
            </TilePricingLabel>
            <TilePricingValue>
              <div>₪{amount}</div>
            </TilePricingValue>
          </TilePricingItem>
        );
      })}
    </TilePricingList>
  );
};

export default PropertyPricing;
