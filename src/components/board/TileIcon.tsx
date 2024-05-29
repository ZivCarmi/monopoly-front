import { cn } from "@/utils";
import {
  ITile,
  isAirport,
  isCard,
  isCompany,
  isCorner,
  isGo,
  isTax,
} from "@ziv-carmi/monopoly-utils";

interface TileIconProps extends React.HTMLAttributes<HTMLDivElement> {
  tile: ITile;
  width?: string;
}

const TileIcon = ({
  tile,
  width = "auto",
  className,
  ...props
}: TileIconProps) => {
  if (!tile?.icon) {
    return null;
  }

  return (
    <div
      className={cn(
        isCard(tile) || isTax(tile)
          ? "p-4"
          : isAirport(tile) || isCompany(tile)
          ? "p-2"
          : isGo(tile)
          ? "pt-4"
          : isCorner(tile)
          ? "pb-4"
          : "p-3",
        className
      )}
      {...props}
    >
      <img
        className="m-auto tileIcon"
        src={`/${tile.icon}-icon.svg`}
        alt={`אייקון ${tile.name}`}
        style={{ width }}
      />
    </div>
  );
};

export default TileIcon;
