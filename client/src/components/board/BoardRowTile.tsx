import { GameTile, isCorner } from "@backend/types/Board";
import { ReactNode } from "react";
import TileBackgroundImage from "./TileBackgroundImage";

type BoardRowTileProps = {
  tile: GameTile;
  children: ReactNode;
};

export const BoardRowTile = ({ tile, children }: BoardRowTileProps) => {
  return (
    <div
      className={`relative border rounded-md border-neutral-700 ${
        isCorner(tile) ? "corner" : "tile"
      }`}
    >
      <TileBackgroundImage tile={tile} />
      {children}
    </div>
  );
};
