import {
  PurchasableTile,
  isAirport,
  isCompany,
  isProperty,
} from "@ziv-carmi/monopoly-utils";
import { Home, Hotel } from "lucide-react";
import { Separator } from "../ui/separator";
import AirportPricing from "./AirportPricing";
import CompanyPricing from "./CompanyPricing";
import PropertyPricing from "./PropertyPricing";
import TileCardPrice from "./TileCardPrice";

const TileCardContent = ({ tile }: { tile: PurchasableTile }) => {
  const isTileProperty = isProperty(tile);

  return (
    <>
      {isTileProperty && <PropertyPricing property={tile} />}
      {isAirport(tile) && <AirportPricing airport={tile} />}
      {isCompany(tile) && <CompanyPricing company={tile} />}
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
