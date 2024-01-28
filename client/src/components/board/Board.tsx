import { cn } from "@/utils";
import { memo } from "react";

type BoardProps = {
  children: React.ReactNode;
  className?: string;
  cornerSize?: number;
  tileSize?: number;
};

const originalCornerSize = document.documentElement.style.getPropertyValue(
  "--board-corner-size"
);
const originalTileSize =
  document.documentElement.style.getPropertyValue("--board-tile-size");

const Board: React.FC<BoardProps> = ({
  children,
  className,
  cornerSize,
  tileSize,
}) => {
  const _cornerSize = cornerSize ? `${cornerSize}px` : originalCornerSize;
  const _tileSize = tileSize ? `${tileSize}px` : originalTileSize;

  const style = {
    "--board-corner-size": _cornerSize,
    "--board-tile-size": _tileSize,
  } as React.CSSProperties;

  return (
    <div className={cn("board ltr gap-1", className)} style={style}>
      {children}
    </div>
  );
};

export default memo(Board);
