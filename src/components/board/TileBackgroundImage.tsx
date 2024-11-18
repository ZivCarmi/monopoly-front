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
    <div className="rounded-[inherit] overflow-hidden flex items-center justify-center absolute inset-0">
      <div
        className={cn(
          "flex items-center justify-center absolute inset-0 blur-sm",
          className
        )}
        {...props}
      >
        <Svg
          name={tile.icon}
          className="brightness-[40%] tileImg [min-inline-size:100%] [min-block-size:100%] shrink-0"
        />
      </div>
    </div>
  );
};

export default TileBackgroundImage;
