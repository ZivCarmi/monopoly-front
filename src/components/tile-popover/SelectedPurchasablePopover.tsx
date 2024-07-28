import { useAppSelector } from "@/app/hooks";
import { isProperty, isPurchasable } from "@ziv-carmi/monopoly-utils";
import TileBackgroundImage from "../board/TileBackgroundImage";
import TileIcon from "../board/TileIcon";
import TileName from "../board/TileName";
import TileCardContent from "./TileCardContent";
import TileCardFooter from "./TileCardFooter";

const SelectedPurchasablePopover = () => {
  const { selectedTile } = useAppSelector((state) => state.ui);

  if (!selectedTile || !isPurchasable(selectedTile)) {
    return null;
  }

  return (
    <>
      {isProperty(selectedTile) && (
        <TileBackgroundImage tile={selectedTile} className="opacity-15" />
      )}
      <div className="relative">
        <div className="flex flex-col text-center">
          <div className="space-y-2 mb-4">
            {!isProperty(selectedTile) && selectedTile.icon && (
              <TileIcon tile={selectedTile} className="w-6 h-6 p-0 m-auto" />
            )}
            <TileName className="text-lg">{selectedTile.name}</TileName>
          </div>
          <div className="grow flex flex-col text-sm">
            <TileCardContent tile={selectedTile} />
          </div>
          <TileCardFooter />
        </div>
      </div>
    </>
  );
};

export default SelectedPurchasablePopover;
