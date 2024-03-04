import { CountryIds } from "@ziv-carmi/monopoly-utils";

type CityFlagIconProps = {
  countryId: CountryIds;
  size?: number;
};

const originalSize =
  document.documentElement.style.getPropertyValue("--flag-icon-size");

const CityFlagIcon: React.FC<CityFlagIconProps> = ({ countryId, size }) => {
  const flagSize = size ? `${size}px` : originalSize;

  const style = {
    "--flag-icon-size": flagSize,
    "--flag-icon-center": `var(--flag-icon-size) / 2`,
    "--city-tile-spacing": `calc(var(--flag-icon-center) + 3px)`,
  } as React.CSSProperties;

  return (
    <img src={`/${countryId}-icon.png`} className="flagIcon" style={style} />
  );
};

export default CityFlagIcon;
