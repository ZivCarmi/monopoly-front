import { cn } from "@/utils";
import { Characters, Colors } from "@backend/types/Player";

export interface PlayerNamePlateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  character?: Characters;
  color?: Colors;
}

const PlayerNamePlate = ({
  name,
  character,
  color,
  className,
  ...props
}: PlayerNamePlateProps) => {
  return (
    <div
      {...props}
      className={cn("flex items-center space-x-2 space-x-reverse", className)}
    >
      <img src={`/${character}.png`} width={32} className="inline-block" />
      <span className="break-all" style={{ color }}>
        {name}
      </span>
    </div>
  );
};
export default PlayerNamePlate;
