import { cn } from "@/utils";
import { IProperty } from "@ziv-carmi/monopoly-utils";
import Svg from "../ui/svg";

interface TileBackgroundImage extends React.HTMLAttributes<HTMLDivElement> {
  tile: IProperty;
}

const TileBackgroundImage = ({
  tile,
  className,
  ...props
}: TileBackgroundImage) => {
  if (!tile.icon) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center absolute inset-0 overflow-hidden rounded-sm blur-sm",
        className
      )}
      {...props}
    >
      <Svg
        name={tile.icon}
        className="max-w-none brightness-[40%] tileImg [min-inline-size:100%] [min-block-size:100%] shrink-0"
      />
    </div>
  );
};

export default TileBackgroundImage;
