import { GameTile, isProperty } from "@ziv-carmi/monopoly-utils";

type TileBackgroundImageProps = {
  tile: GameTile;
};

const TileBackgroundImage = ({ tile }: TileBackgroundImageProps) => {
  let url = "";

  if (isProperty(tile)) {
    url = `/${tile.country.id}-icon.png`;
  }

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden rounded-sm blur-[2px]">
      <div
        className="w-full h-full absolute top-0 left-0 brightness-[40%] tileImg"
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
