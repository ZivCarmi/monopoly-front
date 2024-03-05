import { cn } from "@/utils";
import { Colors } from "@ziv-carmi/monopoly-utils";

export interface PlayerNameProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: string;
  color: Colors;
}

const PlayerName = ({ name, color, className, ...props }: PlayerNameProps) => {
  return (
    <span className={cn("break-all", className)} style={{ color }} {...props}>
      {name}
    </span>
  );
};

export default PlayerName;
