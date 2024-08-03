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
import Svg from "../ui/svg";

interface TileIconProps extends React.HTMLAttributes<HTMLDivElement> {
  tile: ITile;
}

const TileIcon = ({ tile, className, ...props }: TileIconProps) => {
  if (!tile.icon) {
    return null;
  }

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
      <Svg name={tile.icon} className="w-full h-full tileIcon" />
    </div>
  );
};

export default TileIcon;
