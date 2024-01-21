import { CountryIds } from "@backend/types/Board";

const TileBackgroundImage = ({ countryId }: { countryId: CountryIds }) => {
  return (
    <div className="w-full h-full absolute top-0 left-0 -z-10 overflow-hidden">
      <div
        className="w-full h-full absolute top-0 left-0 brightness-[40%] tileImg"
        style={{
          backgroundImage: `url(/${countryId}-icon.png)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};
export default TileBackgroundImage;
