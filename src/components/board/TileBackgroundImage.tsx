import { cn } from "@/utils";
import { IProperty } from "@ziv-carmi/monopoly-utils";

interface TileBackgroundImage extends React.HTMLAttributes<HTMLDivElement> {
  tile: IProperty;
}

const TileBackgroundImage = ({
  tile,
  className,
  ...props
}: TileBackgroundImage) => {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center absolute inset-0 overflow-hidden rounded-sm blur-sm",
        className
      )}
      {...props}
    >
      <img
        src={`/${tile.icon}-icon.svg`}
        className="max-w-none brightness-[40%] tileImg [min-inline-size:100%] [min-block-size:100%] shrink-0"
      />
    </div>
  );
};

export default TileBackgroundImage;
