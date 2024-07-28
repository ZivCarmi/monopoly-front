import { cn, convertRemToPixels } from "@/utils";
import { Colors } from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";

export interface PlayerCharacterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  color: Colors;
  size?: number;
}

const PlayerCharacter = ({
  color,
  size = 1,
  className,
  style,
  ...props
}: PlayerCharacterProps) => {
  const totalHeight = useMemo(() => {
    const remInPixels = convertRemToPixels(size);
    return remInPixels * 2 - remInPixels / 4;
  }, [size]);

  return (
    <div
      className={cn("duration-200", className)}
      style={{ height: totalHeight, ...style }}
      {...props}
    >
      <div
        className={cn("rounded-full")}
        style={{
          backgroundColor: color,
          width: `${size}rem`,
          height: `${size}rem`,
        }}
      />
      <div
        className={cn("relative h-0 -top-1")}
        style={{
          width: `${size}rem`,
          borderBottom: `${size}rem solid ${color}`,
          borderLeft: `${size / 4}rem solid transparent`,
          borderRight: `${size / 4}rem solid transparent`,
        }}
      />
    </div>
  );
};

export default PlayerCharacter;
