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
        "w-full h-full absolute inset-0 overflow-hidden rounded-sm blur-[2px]",
        className
      )}
      {...props}
    >
      <div
        className="w-full h-full brightness-[40%] tileImg"
        style={{
          backgroundImage: `url(/${tile.country.id}-icon.png)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};

export default TileBackgroundImage;
