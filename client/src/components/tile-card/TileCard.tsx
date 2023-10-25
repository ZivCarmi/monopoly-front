import { useAppSelector } from "@/app/hooks";
import TileCardContent from "./TileCardContent";
import TileCardFooter from "./TileCardFooter";

const TileCard = () => {
  const { selectedTile } = useAppSelector((state) => state.ui);

  if (!selectedTile) return null;

  return (
    <div className="rtl text-right">
      <div className="flex flex-col text-center">
        <h2 className="text-lg font-medium">{selectedTile.name}</h2>
        <div className="grow flex flex-col">
          <TileCardContent tile={selectedTile} />
        </div>
        <TileCardFooter />
      </div>
    </div>
  );
};

export default TileCard;
