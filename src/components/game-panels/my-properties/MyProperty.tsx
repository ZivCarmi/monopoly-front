import TileIcon from "@/components/board/TileIcon";
import { PurchasableTile } from "@ziv-carmi/monopoly-utils";
import MyPropertyItem from "./MyPropertyItem";
import SelectedPurchasablePopover from "@/components/tile-popover/SelectedPurchasablePopover";

const MyProperty = ({ tile }: { tile: PurchasableTile }) => {
  const popoverTrigger = (
    <>
      {tile.icon && (
        <TileIcon tile={tile} className="w-4 h-4 p-0 rounded-full" />
      )}
      {tile.name}
    </>
  );

  return (
    <MyPropertyItem
      key={tile.name}
      _content={tile}
      popoverTrigger={{
        children: popoverTrigger,
      }}
    >
      <SelectedPurchasablePopover />
    </MyPropertyItem>
  );
};

export default MyProperty;
