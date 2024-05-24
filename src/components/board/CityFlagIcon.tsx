import { CountryIds } from "@ziv-carmi/monopoly-utils";

const CityFlagIcon = ({ countryId }: { countryId: CountryIds }) => {
  return <img src={`/${countryId}-icon.png`} className="flagIcon" />;
};

export default CityFlagIcon;
