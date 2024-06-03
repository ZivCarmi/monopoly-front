import { cn } from "@/utils";
import { CountryIds } from "@ziv-carmi/monopoly-utils";

interface CityFlagIconProps extends React.HTMLAttributes<HTMLImageElement> {
  countryId: CountryIds;
}

const CityFlagIcon = ({
  countryId,
  className,
  ...props
}: CityFlagIconProps) => {
  return (
    <img
      src={`/${countryId}-icon.png`}
      className={cn("flagIcon", className)}
      {...props}
    />
  );
};

export default CityFlagIcon;
