import { cn } from "@/utils";
import { GameTile, isCorner } from "@ziv-carmi/monopoly-utils";
import { ReactNode } from "react";

type BoardRowTileProps = {
  tile: GameTile;
  children: ReactNode;
};

const BoardRowTile = ({ tile, children }: BoardRowTileProps) => {
  return (
    <div
      className={cn(
        `relative rounded-md tile ${tile.type.toLowerCase()}`,
        isCorner(tile) && "corner"
      )}
    >
      {children}
    </div>
  );
};

export default BoardRowTile;
