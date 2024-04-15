import { cn } from "@/utils";
import { Colors } from "@ziv-carmi/monopoly-utils";

export interface PlayerCharacterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  color: Colors;
  size?: number;
  showHalo?: boolean;
}

const PlayerCharacter = ({
  color,
  size = 1,
  showHalo,
  className,
  ...props
}: PlayerCharacterProps) => {
  return (
    <div
      style={{
        filter: showHalo ? `drop-shadow(0px 0px 16px ${color})` : undefined,
      }}
      className={cn("duration-200", className)}
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
        className={cn("relative h-0 -top-1", className)}
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
