import { cn } from "@/utils";
import { ITile } from "@ziv-carmi/monopoly-utils";
import TileIcon from "./TileIcon";
import TileName from "./TileName";

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  tile?: ITile;
  hideTileName?: boolean;
}

const Tile = ({
  tile,
  hideTileName = false,
  children,
  className,
  ...props
}: TileProps) => {
  return (
    <div {...props} className={cn("flex w-full h-full", className)}>
      {tile && (
        <div className="flex items-center flex-col tileNameIcon">
          <TileIcon tile={tile} />
          {!hideTileName && <TileName>{tile.name}</TileName>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Tile;
