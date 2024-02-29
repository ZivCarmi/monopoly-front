import { GameTile, isCorner } from "@backend/types/Board";
import { ReactNode } from "react";
import TileBackgroundImage from "./TileBackgroundImage";
import { cn } from "@/utils";

type BoardRowTileProps = {
  tile: GameTile;
  children: ReactNode;
};

const BoardRowTile = ({ tile, children }: BoardRowTileProps) => {
  return (
    <div
      className={cn(
        "relative border rounded-md border-neutral-700 tile",
        isCorner(tile) && `corner ${tile.type.toLowerCase()}`
      )}
    >
      <TileBackgroundImage tile={tile} />
      {children}
    </div>
  );
};

export default BoardRowTile;
