import { cn } from "@/utils";
import { ITile } from "@ziv-carmi/monopoly-utils";
import TileIcon from "./TileIcon";
import TileName from "./TileName";
import { BoardRow } from "@/types/Board";

interface TileWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  rowSide: BoardRow;
}

export const TileWrapper = ({
  rowSide,
  className,
  ...props
}: TileWrapperProps) => {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col-reverse",
        rowSide === "top" && "flex-col",
        className
      )}
      {...props}
    />
  );
};

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  tile?: ITile;
  hideTileName?: boolean;
  rowSide?: BoardRow;
}

const Tile = ({
  tile,
  hideTileName = false,
  rowSide,
  children,
  className,
  ...props
}: TileProps) => {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col",
        rowSide === "top" && "flex-col-reverse",
        className
      )}
      {...props}
    >
      {tile && (
        <div className={cn("flex items-center [flex-direction:inherit]")}>
          <TileIcon tile={tile} />
          {!hideTileName && <TileName>{tile.name}</TileName>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Tile;
