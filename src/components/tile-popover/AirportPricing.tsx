import { getPlayerAirports, getPlayerColor } from "@/utils";
import { AIRPORT_RENTS, IAirport } from "@ziv-carmi/monopoly-utils";
import { Plane } from "lucide-react";
import {
  PurchasableTileIconContainer,
  PurchasableTileIconCount,
} from "../board/PurchasableTileIcon";
import {
  TilePricingInstructions,
  TilePricingItem,
  TilePricingLabel,
  TilePricingList,
  TilePricingValue,
} from "./TilePricing";

const AirportPricing = ({ airport }: { airport: IAirport }) => {
  const ownedAirportsCount =
    airport.owner && getPlayerAirports(airport.owner).length;
  const ownerColor = airport.owner && getPlayerColor(airport.owner);

  return (
    <TilePricingList>
      <TilePricingInstructions />
      {AIRPORT_RENTS.map((price, i) => (
        <TilePricingItem
          key={price}
          style={{
            backgroundColor:
              ownerColor && Number(ownedAirportsCount) - 1 === i
                ? ownerColor
                : "",
          }}
        >
          <TilePricingLabel>
            <PurchasableTileIconContainer>
              <Plane className="w-4 h-4" />
              <PurchasableTileIconCount rentIndex={i + 1} />
            </PurchasableTileIconContainer>
          </TilePricingLabel>
          <TilePricingValue>₪{price}</TilePricingValue>
        </TilePricingItem>
      ))}
    </TilePricingList>
  );
};

export default AirportPricing;
