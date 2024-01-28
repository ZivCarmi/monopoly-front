import { cn } from "@/utils";
import { ITile } from "@backend/types/Board";

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  tile?: ITile;
  showName?: boolean;
}

const Tile: React.FC<TileProps> = ({ tile, children, ...props }) => {
  return (
    <div {...props} className={cn("flex w-full h-full", props.className)}>
      {tile && <div className="text-sm text-center">{tile.name}</div>}
      {children}
    </div>
  );
};

export default Tile;
