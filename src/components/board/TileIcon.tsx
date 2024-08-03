import { cn } from "@/utils";
import {
  ITile,
  isAirport,
  isCard,
  isCompany,
  isGo,
  isGoToJail,
  isProperty,
  isTax,
  isVacation,
} from "@ziv-carmi/monopoly-utils";

interface TileIconProps extends React.HTMLAttributes<HTMLDivElement> {
  tile: ITile;
}

const TileIcon = ({ tile, className, ...props }: TileIconProps) => {
  if (!tile.icon) {
    return null;
  }

  const alt = isProperty(tile)
    ? `דגל ${tile.country.name}`
    : `אייקון ${tile.name}`;

  return (
    <div
      className={cn(
        (isCard(tile) || isTax(tile)) && "p-4",
        (isAirport(tile) || isCompany(tile)) && "p-2",
        (isVacation(tile) || isGoToJail(tile)) && "pb-3",
        isGo(tile) && "pt-3",
        isProperty(tile) && "rounded-full overflow-hidden",
        "tileIconWrapper",
        className
      )}
      {...props}
    >
      <img
        className="w-full h-full tileIcon"
        src={`/${tile.icon}-icon.svg`}
        alt={alt}
      />
    </div>
  );
};

export default TileIcon;
