import { useAppSelector } from "@/app/hooks";
import { isProperty, isPurchasable } from "@ziv-carmi/monopoly-utils";
import TileBackgroundImage from "../board/TileBackgroundImage";
import TileIcon from "../board/TileIcon";
import TileName from "../board/TileName";
import TileCardContent from "./TileCardContent";
import TileCardFooter from "./TileCardFooter";

const SelectedPurchasablePopover = () => {
  const { selectedPopover } = useAppSelector((state) => state.game);

  if (!selectedPopover || !isPurchasable(selectedPopover)) {
    return null;
  }

  return (
    <>
      {isProperty(selectedPopover) && (
        <TileBackgroundImage tile={selectedPopover} className="opacity-15" />
      )}
      <div className="relative">
        <div className="flex flex-col text-center">
          <div className="space-y-2 mb-4">
            {!isProperty(selectedPopover) && selectedPopover.icon && (
              <TileIcon tile={selectedPopover} className="w-6 h-6 p-0 m-auto" />
            )}
            <TileName className="text-lg">{selectedPopover.name}</TileName>
          </div>
          <div className="grow flex flex-col text-sm">
            <TileCardContent tile={selectedPopover} />
          </div>
          <TileCardFooter />
        </div>
      </div>
    </>
  );
};

export default SelectedPurchasablePopover;
