import { cn } from "@/utils";
import { ITile } from "@backend/types/Board";
import TileName from "./TileName";

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  tile?: ITile;
  hideTileName?: boolean;
}

const Tile: React.FC<TileProps> = ({
  tile,
  children,
  className,
  hideTileName = false,
  ...props
}) => {
  return (
    <div {...props} className={cn("flex w-full h-full", className)}>
      {tile && !hideTileName && <TileName>{tile.name}</TileName>}
      {children}
    </div>
  );
};

export default Tile;
