import {
  AIRPORT_RENTS,
  COMPANY_RENTS,
  PurchasableTile,
  isAirport,
  isCompany,
  isProperty,
} from "@ziv-carmi/monopoly-utils";
import { Home, Hotel, Plane } from "lucide-react";
import { Separator } from "../ui/separator";
import CompanyPricing from "./CompanyPricing";
import IndustryPricing from "./IndustryPricing";
import PropertyPricing from "./PropertyPricing";
import TileCardPrice from "./TileCardPrice";

const TileCardContent = ({ tile }: { tile: PurchasableTile }) => {
  const isTileProperty = isProperty(tile);

  return (
    <>
      {isTileProperty && <PropertyPricing rent={tile.rent} />}
      {isAirport(tile) && <IndustryPricing rent={AIRPORT_RENTS} icon={Plane} />}
      {isCompany(tile) && <CompanyPricing rent={COMPANY_RENTS} />}
      <Separator className="w-20 my-4 mx-auto" />
      <div className="flex items-center justify-evenly gap-4">
        <TileCardPrice amount={tile.cost} labelAsText="מחיר" />
        {isTileProperty && (
          <>
            <TileCardPrice amount={tile.houseCost} labelAsIcon={Home} />
            <TileCardPrice amount={tile.hotelCost} labelAsIcon={Hotel} />
          </>
        )}
      </div>
    </>
  );
};

export default TileCardContent;
