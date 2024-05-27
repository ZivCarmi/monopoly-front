import { cn } from "@/utils";
import { GameTile, isProperty } from "@ziv-carmi/monopoly-utils";

interface TileBackgroundImage extends React.HTMLAttributes<HTMLDivElement> {
  tile: GameTile;
}

const TileBackgroundImage = ({
  tile,
  className,
  ...props
}: TileBackgroundImage) => {
  let url = "";

  if (isProperty(tile)) {
    url = `/${tile.country.id}-icon.png`;
  }

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
          backgroundImage: `url(${url})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};

export default TileBackgroundImage;
