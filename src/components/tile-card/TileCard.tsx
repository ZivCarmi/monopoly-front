import { useAppSelector } from "@/app/hooks";
import TileCardContent from "./TileCardContent";
import TileCardFooter from "./TileCardFooter";
import TileIcon from "../board/TileIcon";

const TileCard = () => {
  const { selectedTile } = useAppSelector((state) => state.ui);

  if (!selectedTile) return null;

  return (
    <div className="rtl text-right relative">
      <div className="flex flex-col text-center">
        <div className="space-y-2 mb-4">
          {selectedTile?.icon && (
            <TileIcon tile={selectedTile} width="32px" className="p-0" />
          )}
          <h2 className="text-lg font-bold tracking-tight">
            {selectedTile.name}
          </h2>
        </div>
        <div className="grow flex flex-col text-sm">
          <TileCardContent tile={selectedTile} />
        </div>
        <TileCardFooter />
      </div>
    </div>
  );
};

export default TileCard;
