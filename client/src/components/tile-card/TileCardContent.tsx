import { AIRPORT_RENTS, COMPANY_RENTS } from "@backend/constants";
import {
  PurchasableTile,
  isAirport,
  isCompany,
  isProperty,
} from "@backend/types/Board";
import { Factory, Home, Hotel, Plane } from "lucide-react";
import IndustryPricing from "./IndustryPricing";
import TileCardPrice from "./TileCardPrice";
import { Separator } from "../ui/separator";

type TileCardContentProps = {
  tile: PurchasableTile;
};

const TileCardContent: React.FC<TileCardContentProps> = ({ tile }) => {
  const isTileProperty = isProperty(tile);

  return (
    <>
      {isTileProperty && (
        <ul className="space-y-1">
          {Object.values(tile.rent).map((amount, i) => (
            <li className="flex items-center justify-between" key={amount}>
              <div className="text-right">
                {i === 0 && (
                  <>
                    <div className="font-medium">דמי שכירות</div>
                    <div className="font-medium">בעלות על סדרה</div>
                  </>
                )}
                {i > 0 &&
                  i < 5 &&
                  Array.from({ length: i }, (_, idx) => (
                    <Home className="inline text-red-900" key={idx} />
                  ))}
                {i === 5 && <Hotel className="inline text-red-900" />}
              </div>
              <div>
                <div>${amount}</div>
                {i === 0 && <div>${amount * 2}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {isAirport(tile) && <IndustryPricing rent={AIRPORT_RENTS} icon={Plane} />}
      {isCompany(tile) && (
        <IndustryPricing rent={COMPANY_RENTS} icon={Factory} />
      )}
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
