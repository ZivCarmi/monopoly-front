import { Dices, X } from "lucide-react";
import PlayerMoney from "../player/PlayerMoney";
import { TilePricingItem, TilePricingList } from "./TilePricing";
import { COMPANY_RENTS, ICompany } from "@ziv-carmi/monopoly-utils";
import { getPlayerColor, getPlayerCompanies } from "@/utils";

const CompanyPricing = ({ company }: { company: ICompany }) => {
  const ownedCompaniesCount =
    company.owner && getPlayerCompanies(company.owner).length;
  const ownerColor = company.owner && getPlayerColor(company.owner);

  return (
    <TilePricingList>
      {COMPANY_RENTS.map((price, i) => (
        <TilePricingItem
          className="inline-block text-center w-full"
          style={{
            backgroundColor:
              ownerColor && Number(ownedCompaniesCount) - 1 === i
                ? ownerColor
                : "",
          }}
        >
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
