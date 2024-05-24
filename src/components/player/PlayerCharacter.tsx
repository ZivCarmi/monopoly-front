import { cn } from "@/utils";
import { Colors } from "@ziv-carmi/monopoly-utils";

export interface PlayerCharacterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  color: Colors;
  size?: number;
}

const PlayerCharacter = ({
  color,
  size = 1,
  className,
  ...props
}: PlayerCharacterProps) => {
  return (
    <div className={cn("duration-200", className)} {...props}>
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
